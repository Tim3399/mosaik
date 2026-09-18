import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const srcDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokensCss = readFileSync(join(srcDir, "foundations", "tokens.css"), "utf8");

// AP2 design checkpoint: the candidate design directions live outside the library and set other
// values for the same token roles. The contrast checks run against each of them as well.
const directionsDir = join(srcDir, "..", "..", "..", "explorations", "design-directions");
const directionSources = readdirSync(join(directionsDir, "directions"))
  .filter((file) => file.endsWith(".css"))
  .sort()
  .map((file): [source: string, css: string] => [
    `direction ${file}`,
    readFileSync(join(directionsDir, "directions", file), "utf8"),
  ]);
const tokenSources: Array<[source: string, css: string]> = [
  ["tokens.css", tokensCss],
  ...directionSources,
];

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

type Mode = "light" | "dark";

/** Reads `--name: var(--_mosaik-light, #light) var(--_mosaik-dark, #dark)` declarations. */
function readColorTokens(css: string): Map<string, Record<Mode, string>> {
  const tokens = new Map<string, Record<Mode, string>>();
  const declaration =
    /(--mosaik-[a-z-]+):\s*var\(--_mosaik-light,\s*(#[0-9a-f]{6})\)\s*var\(--_mosaik-dark,\s*(#[0-9a-f]{6})\)\s*;/gi;
  for (const match of css.matchAll(declaration)) {
    const [, name, light, dark] = match;
    if (name && light && dark) tokens.set(name, { light, dark });
  }
  return tokens;
}

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255);
  const [r, g, b] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  ) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a,
  ) as [number, number];
  return (lighter + 0.05) / (darker + 0.05);
}

// Pairs that components actually render together. WCAG 2.2 AA: 4.5:1 for text,
// 3:1 for essential non-text indicators such as field borders and focus rings.
const requiredContrast: Array<[foreground: string, background: string, minimum: number]> = [
  ["--mosaik-color-text", "--mosaik-color-canvas", 4.5],
  ["--mosaik-color-text", "--mosaik-color-surface", 4.5],
  ["--mosaik-color-text", "--mosaik-color-field", 4.5],
  ["--mosaik-color-text", "--mosaik-color-subtle-hover", 4.5],
  ["--mosaik-color-text", "--mosaik-color-subtle-active", 4.5],
  ["--mosaik-color-text-muted", "--mosaik-color-canvas", 4.5],
  ["--mosaik-color-text-muted", "--mosaik-color-surface", 4.5],
  ["--mosaik-color-text-muted", "--mosaik-color-field", 4.5],
  ["--mosaik-color-danger", "--mosaik-color-canvas", 4.5],
  ["--mosaik-color-danger", "--mosaik-color-surface", 4.5],
  ["--mosaik-color-danger", "--mosaik-color-field", 3],
  ["--mosaik-color-border-strong", "--mosaik-color-surface", 3],
  ["--mosaik-color-border-strong", "--mosaik-color-field", 3],
  ["--mosaik-color-border-strong", "--mosaik-color-canvas", 3],
  ["--mosaik-color-focus", "--mosaik-color-canvas", 3],
  ["--mosaik-color-focus", "--mosaik-color-surface", 3],
  ["--mosaik-color-focus", "--mosaik-color-field", 3],
  ["--mosaik-accent-on-solid", "--mosaik-accent-solid", 4.5],
  ["--mosaik-accent-on-solid", "--mosaik-accent-solid-hover", 4.5],
  ["--mosaik-accent-on-solid", "--mosaik-accent-solid-active", 4.5],
];

describe.each(tokenSources)("foundation color tokens: %s", (_source, css) => {
  const colorTokens = readColorTokens(css);

  it("writes every color token in the scoped toggle form, never with light-dark()", () => {
    // light-dark() gets rewritten by consumer bundlers into a variant that breaks nested scopes.
    expect(stripComments(css)).not.toMatch(/light-dark\(/);
    const colorDeclarations = css.match(/--mosaik-(?:color|accent)-[a-z-]+\s*:/g) ?? [];
    expect(colorDeclarations.length).toBeGreaterThan(0);
    expect(colorTokens.size).toBe(colorDeclarations.length);
  });

  for (const mode of ["light", "dark"] as const) {
    it.each(requiredContrast)(`${mode}: %s on %s reaches %s:1`, (foreground, background, min) => {
      const fg = colorTokens.get(foreground);
      const bg = colorTokens.get(background);
      expect(fg, `${foreground} is not defined as a hex color`).toBeDefined();
      expect(bg, `${background} is not defined as a hex color`).toBeDefined();
      expect(contrastRatio(fg?.[mode] ?? "", bg?.[mode] ?? "")).toBeGreaterThanOrEqual(min);
    });
  }
});

describe("design directions (AP2 checkpoint)", () => {
  /** Declared custom property names, including the private mode toggles. */
  const declaredNames = (css: string) =>
    [...new Set([...stripComments(css).matchAll(/(--_?mosaik-[a-z0-9-]+)\s*:/g)].map((m) => m[1]))]
      .filter((name): name is string => name !== undefined)
      .sort();
  const libraryRoles = declaredNames(tokensCss).filter((name) => !name.startsWith("--_"));

  it("offers two or three directions", () => {
    expect(directionSources.length).toBeGreaterThanOrEqual(2);
    expect(directionSources.length).toBeLessThanOrEqual(3);
  });

  it.each(directionSources)(
    "%s sets values for exactly the library's roles and leaves the mode toggles alone",
    (_source, css) => {
      expect(declaredNames(css)).toEqual(libraryRoles);
    },
  );
});

describe("stylesheet contract", () => {
  const cssFiles = readdirSync(srcDir, { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith(".css"))
    .map((file) => join(srcDir, file));
  const definedTokens = new Set(
    [...tokensCss.matchAll(/(--_?mosaik-[a-z0-9-]+)\s*:/g)].map((match) => match[1]),
  );

  it.each(cssFiles.map((file) => [relative(srcDir, file).replaceAll("\\", "/"), file]))(
    "%s only uses defined tokens and prefixed classes",
    (_name, file) => {
      const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
      const usedTokens = [...css.matchAll(/var\(\s*(--[_a-z0-9-]+)/gi)].map((match) => match[1]);
      expect(usedTokens.filter((token) => !definedTokens.has(token))).toEqual([]);

      // Class selectors only: drop strings, @layer/@import preludes and declaration values.
      const selectors = css
        .replace(/"[^"]*"/g, "")
        .replace(/@(layer|import)[^{;]*[{;]/g, "")
        .replace(/:[^;{}]*;/g, ";");
      const classes = [...selectors.matchAll(/\.(-?[_a-z][_a-z0-9-]*)/gi)].map((match) => match[1]);
      expect(classes.filter((name) => !name?.startsWith("mosaik-"))).toEqual([]);
    },
  );

  it("imports every component stylesheet from the entry", () => {
    const entry = readFileSync(join(srcDir, "styles", "index.css"), "utf8");
    const componentStyles = cssFiles
      .map((file) => relative(srcDir, file).replaceAll("\\", "/"))
      .filter((file) => file.startsWith("components/"));
    for (const stylesheet of componentStyles) {
      expect(entry).toContain(`@import "../${stylesheet}";`);
    }
  });
});
