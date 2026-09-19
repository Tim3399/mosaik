#!/usr/bin/env node
// Renders the direction pages and takes whole-page screenshots of every direction in light and
// dark mode at 320 px (touch device) and 1440 px (desktop), plus comparison sheets of the
// scenario form. Hover, pressed and focus are real pseudo-classes forced through the Chrome
// DevTools Protocol on the rendered elements. Every page is checked with axe while the states
// are forced and the decorative textures are off; contrast violations fail the run. Chromium only; run
// "npx playwright install chromium" once. Needs network access for the linked fonts.
// Usage: node capture.mjs [direction-id ...]   Output: .tmp/design-directions/screenshots/.
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";
import { concepts, modes, outputDir, pageFile, renderPages } from "./render.mjs";

const viewports = [
  {
    id: "320",
    sheetColumns: "concepts",
    options: {
      viewport: { width: 320, height: 640 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
  },
  {
    id: "1440",
    sheetColumns: "modes",
    options: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  },
];

const forcedStates = [
  ['[data-dd-state="hover"] button', ["hover"]],
  ['[data-dd-state="pressed"] button', ["hover", "active"]],
  [
    '[data-dd-state="focus"] button, [data-dd-state="focus"] input:not([type="color"])',
    ["focus", "focus-visible"],
  ],
];

/** Forces the pseudo-classes; they hold while the returned session stays attached. */
async function forceStates(page) {
  const session = await page.context().newCDPSession(page);
  await session.send("DOM.enable");
  await session.send("CSS.enable");
  const { root } = await session.send("DOM.getDocument", { depth: -1 });
  for (const [selector, forcedPseudoClasses] of forcedStates) {
    const { nodeIds } = await session.send("DOM.querySelectorAll", {
      nodeId: root.nodeId,
      selector,
    });
    if (nodeIds.length === 0) throw new Error(`no element matches ${selector}`);
    for (const nodeId of nodeIds) {
      await session.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses });
    }
  }
  return session;
}

/** Fails when a forced state does not change the rendering it is supposed to change. */
async function verifyStates(page) {
  const problems = await page.evaluate(() => {
    const look = (stateName) => {
      const element = document.querySelector(
        `[data-dd-state="${stateName}"] button[data-variant="primary"]`,
      );
      const style = getComputedStyle(element);
      return [
        style.backgroundColor,
        style.backgroundImage,
        style.borderColor,
        style.boxShadow,
        style.color,
        style.transform,
      ].join("|");
    };
    const found = [];
    if (look("hover") === look("default")) found.push("hover did not apply");
    if (look("pressed") === look("hover")) found.push("pressed did not apply");
    const focused = document.querySelectorAll(
      '[data-dd-state="focus"] button, [data-dd-state="focus"] input:not([type="color"])',
    );
    for (const element of focused) {
      if (getComputedStyle(element).outlineStyle === "none") found.push("focus ring missing");
    }
    return found;
  });
  if (problems.length > 0) throw new Error(`forced states failed: ${problems.join(", ")}`);
}

/** Fails when a linked font family did not load, for example without network access. */
async function verifyFonts(page, concept) {
  const missing = await page.evaluate(async (families) => {
    const absent = [];
    for (const family of families) {
      const faces = await document.fonts.load(`16px "${family}"`, "Aa");
      if (faces.length === 0) absent.push(family);
    }
    await document.fonts.ready;
    return absent;
  }, concept.families);
  if (missing.length > 0) throw new Error(`${concept.id}: fonts not loaded: ${missing.join(", ")}`);
}

/** Fails when the pointer emulation differs from the viewport's, for example a lost touch mode. */
async function verifyPointer(page, { id, options }) {
  const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
  if (coarse !== Boolean(options.hasTouch)) {
    throw new Error(`${id} px: expected a ${options.hasTouch ? "coarse" : "fine"} pointer`);
  }
}

/**
 * Captures the page at its whole height. Chromium drops the touch emulation during
 * `fullPage` screenshots, so the viewport grows to the page height instead.
 */
async function capturePage(page, { options }, screenshotOptions = {}) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.setViewportSize({ width: options.viewport.width, height });
  try {
    return await page.screenshot(screenshotOptions);
  } finally {
    await page.setViewportSize(options.viewport);
  }
}

/** The scenario form with a margin of page canvas, so surface and canvas can be compared. */
async function captureScenario(page, viewport) {
  const margin = 16;
  const box = await page.locator(".dd-scenario").boundingBox();
  const clip = {
    x: Math.max(0, box.x - margin),
    y: box.y - margin,
    width: Math.min(viewport.options.viewport.width, box.width + 2 * margin),
    height: box.height + 2 * margin,
  };
  return { png: await capturePage(page, viewport, { clip }), width: clip.width };
}

/** Places the scenario crops side by side: concepts as rows or as columns. */
async function composeSheet(browser, screenshotDir, crops, { id, sheetColumns, options }) {
  const gap = 24;
  const shown = concepts.filter((concept) => crops.some((crop) => crop.concept === concept));
  const [columns, rows] =
    sheetColumns === "modes" ? [modes.length, shown.length] : [shown.length, modes.length];
  const cell = (concept, mode) => {
    const crop = crops.find((entry) => entry.concept === concept && entry.mode === mode);
    const source = `data:image/png;base64,${crop.png.toString("base64")}`;
    return `<figure style="margin:0"><figcaption style="margin-bottom:8px;font-weight:600">${concept.letter} ${concept.name} · ${mode}</figcaption><img src="${source}" width="${crop.width}" alt=""></figure>`;
  };
  const cells =
    sheetColumns === "modes"
      ? shown.flatMap((concept) => modes.map((mode) => cell(concept, mode)))
      : modes.flatMap((mode) => shown.map((concept) => cell(concept, mode)));
  const columnWidth = Math.max(...crops.map((crop) => crop.width));
  const html = `<!doctype html><html lang="en"><body style="margin:0;padding:${gap}px;background:#bdbdbd;color:#161616;font:14px/1.4 system-ui,sans-serif">
<h1 style="margin:0 0 ${gap}px;font-size:18px">mosaik AP2 design directions · scenario at ${id} px</h1>
<div style="display:grid;grid-template-columns:repeat(${columns},${columnWidth}px);gap:${gap}px;align-items:start">
${cells.join("\n")}
</div></body></html>`;
  const context = await browser.newContext({
    viewport: { width: columns * (columnWidth + gap) + gap, height: 600 },
    deviceScaleFactor: options.deviceScaleFactor,
  });
  const page = await context.newPage();
  await page.setContent(html);
  const name = `compare-scenario-${id}.png`;
  await page.screenshot({ path: join(screenshotDir, name), fullPage: true });
  await context.close();
  console.log(`composed ${name} (${rows} rows)`);
}

/**
 * Runs axe and returns its contrast violations. axe cannot measure text on background images
 * or with text shadows and only reports such nodes as incomplete. Textures are decorative in
 * every concept, so they are switched off during the run and text is measured against the solid
 * colors underneath; nodes that stay unmeasured are reported.
 */
async function checkAccessibility(page, where) {
  const flat = await page.addStyleTag({
    content:
      "*, *::before, *::after { background-image: none !important; text-shadow: none !important; }",
  });
  try {
    const { violations, incomplete } = await new AxeBuilder({ page }).analyze();
    const contrast = [];
    for (const violation of violations) {
      const targets = violation.nodes.map((node) => node.target.join(" ")).slice(0, 4);
      const line = `${where}: ${violation.id} (${violation.nodes.length}) ${targets.join(" | ")}`;
      if (violation.id === "color-contrast") contrast.push(line);
      else console.warn(`axe ${line}`);
    }
    const unmeasured = incomplete
      .filter((result) => result.id === "color-contrast")
      .flatMap((result) => result.nodes);
    if (unmeasured.length > 0) {
      const reasons = [...new Set(unmeasured.map((node) => node.any[0]?.data?.messageKey))];
      console.warn(
        `${where}: ${unmeasured.length} text nodes not measured (${reasons.join(", ")})`,
      );
    }
    return contrast;
  } finally {
    await flat.evaluate((element) => element.remove());
  }
}

const selected = process.argv.slice(2);
const chosen = selected.length > 0 ? concepts.filter((c) => selected.includes(c.id)) : concepts;
if (chosen.length === 0) throw new Error(`unknown concepts: ${selected.join(", ")}`);

renderPages(chosen);
const screenshotDir = join(outputDir, "screenshots");
mkdirSync(screenshotDir, { recursive: true });
const contrastProblems = [];
const browser = await chromium.launch();
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ ...viewport.options, reducedMotion: "reduce" });
    const page = await context.newPage();
    const crops = [];
    for (const concept of chosen) {
      for (const mode of modes) {
        await page.goto(pathToFileURL(join(outputDir, pageFile(concept, mode))).href);
        await verifyFonts(page, concept);
        await verifyPointer(page, viewport);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        if (overflow > 0) {
          console.warn(`${concept.id} ${mode} ${viewport.id}: ${overflow} px overflow`);
        }
        crops.push({ concept, mode, ...(await captureScenario(page, viewport)) });
        const session = await forceStates(page);
        await verifyStates(page);
        contrastProblems.push(
          ...(await checkAccessibility(page, `${concept.id} ${mode} ${viewport.id}`)),
        );
        const name = `${concept.letter.toLowerCase()}-${concept.id}-${mode}-${viewport.id}.png`;
        await capturePage(page, viewport, { path: join(screenshotDir, name) });
        await session.detach();
        await verifyPointer(page, viewport);
        console.log(`captured ${name}`);
      }
    }
    await context.close();
    if (chosen.length === concepts.length) {
      await composeSheet(browser, screenshotDir, crops, viewport);
    }
  }
} finally {
  await browser.close();
}
if (contrastProblems.length > 0) {
  throw new Error(`contrast violations:\n${contrastProblems.join("\n")}`);
}
