#!/usr/bin/env node
// Renders the specimen pages and takes whole-page screenshots of every direction in light and
// dark mode at 320 px (touch device) and 1440 px (desktop), plus one comparison sheet of the
// scenario form per width. Hover, pressed and focus are real pseudo-classes forced through the
// Chrome DevTools Protocol on the rendered elements, so the screenshots show the component CSS
// as shipped. Chromium only; run "npx playwright install chromium" once.
// Output: .tmp/design-directions/screenshots/.
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { directions, modes, outputDir, pageFile, renderPages } from "./render.mjs";

const viewports = [
  {
    id: "320",
    options: {
      viewport: { width: 320, height: 640 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
  },
  { id: "1440", options: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
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
    const style = (selector) => {
      const element = document.querySelector(selector);
      return element ? getComputedStyle(element) : null;
    };
    const primary = (stateName) =>
      style(`[data-dd-state="${stateName}"] button[data-variant="primary"]`)?.backgroundColor;
    const found = [];
    if (primary("hover") === primary("default")) found.push("hover did not apply");
    if (primary("pressed") === primary("hover")) found.push("pressed did not apply");
    const focused = document.querySelectorAll(
      '[data-dd-state="focus"] button, [data-dd-state="focus"] input:not([type="color"])',
    );
    for (const element of focused) {
      if (getComputedStyle(element).outlineStyle !== "solid") found.push("focus ring missing");
    }
    return found;
  });
  if (problems.length > 0) throw new Error(`forced states failed: ${problems.join(", ")}`);
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
  // Smaller than the smallest gap to neighboring text in every direction.
  const margin = 10;
  const box = await page.locator(".dd-scenario").boundingBox();
  const clip = {
    x: box.x - margin,
    y: box.y - margin,
    width: box.width + 2 * margin,
    height: box.height + 2 * margin,
  };
  return { png: await capturePage(page, viewport, { clip }), width: clip.width };
}

/** Places the scenario crops of all directions side by side, light above dark. */
async function composeSheet(browser, screenshotDir, crops, { id, options }) {
  const gap = 24;
  const columnWidth = Math.max(...crops.map((crop) => crop.width));
  const cells = modes.flatMap((mode) =>
    directions.map((direction) => {
      const crop = crops.find((entry) => entry.direction === direction && entry.mode === mode);
      const source = `data:image/png;base64,${crop.png.toString("base64")}`;
      return `<figure style="margin:0"><figcaption style="margin-bottom:8px;font-weight:600">${direction.letter} · ${direction.name} · ${mode}</figcaption><img src="${source}" width="${crop.width}" alt=""></figure>`;
    }),
  );
  const html = `<!doctype html><html lang="en"><body style="margin:0;padding:${gap}px;background:#c9c9c9;color:#161616;font:14px/1.4 system-ui,sans-serif">
<h1 style="margin:0 0 ${gap}px;font-size:18px">mosaik AP2 design checkpoint · scenario at ${id} px</h1>
<div style="display:grid;grid-template-columns:repeat(${directions.length},${columnWidth}px);gap:${gap}px;align-items:start">
${cells.join("\n")}
</div></body></html>`;
  const context = await browser.newContext({
    viewport: { width: directions.length * (columnWidth + gap) + gap, height: 600 },
    deviceScaleFactor: options.deviceScaleFactor,
  });
  const page = await context.newPage();
  await page.setContent(html);
  const name = `compare-scenario-${id}.png`;
  await page.screenshot({ path: join(screenshotDir, name), fullPage: true });
  await context.close();
  console.log(`composed ${name}`);
}

renderPages();
const screenshotDir = join(outputDir, "screenshots");
mkdirSync(screenshotDir, { recursive: true });
const browser = await chromium.launch();
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ ...viewport.options, reducedMotion: "reduce" });
    const page = await context.newPage();
    const crops = [];
    for (const direction of directions) {
      for (const mode of modes) {
        await page.goto(pathToFileURL(join(outputDir, pageFile(direction, mode))).href);
        await verifyPointer(page, viewport);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        if (overflow > 0) {
          console.warn(`${direction.id} ${mode} ${viewport.id}: ${overflow} px overflow`);
        }
        crops.push({ direction, mode, ...(await captureScenario(page, viewport)) });
        const session = await forceStates(page);
        await verifyStates(page);
        const name = `${direction.letter.toLowerCase()}-${direction.id}-${mode}-${viewport.id}.png`;
        await capturePage(page, viewport, { path: join(screenshotDir, name) });
        await session.detach();
        await verifyPointer(page, viewport);
        console.log(`captured ${name}`);
      }
    }
    await context.close();
    await composeSheet(browser, screenshotDir, crops, viewport);
  }
} finally {
  await browser.close();
}
