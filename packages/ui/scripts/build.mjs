#!/usr/bin/env node
// Builds dist/: one ES module and declaration file per source file via tsc, one stylesheet via
// Lightning CSS. Then it adds the license notice and verifies that client directives survived.
// `--watch` rebuilds after source changes and keeps running until interrupted; with
// `--skip-initial` it only watches, for callers that ran a clean build just before.
import { spawnSync } from "node:child_process";
import { watch } from "node:fs";
import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "lightningcss";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(packageRoot, "src");
const distDir = join(packageRoot, "dist");
const require = createRequire(import.meta.url);

const NOTICE =
  "@tim3399/mosaik | Required Notice: Copyright 2026 Tim Ratermann (https://github.com/Tim3399/mosaik) | " +
  "License: PolyForm Noncommercial License 1.0.0 with Additional Permission for Small Companies, see LICENSE.md";
const BANNER = `/*! @license ${NOTICE} */`;
const CLIENT_DIRECTIVE = /^\s*["']use client["'];?/;

// Versions that support every platform feature the styles use natively, including light-dark().
// Lightning CSS must not lower light-dark(): its fallback depends on extra color-scheme rules.
const cssTargets = {
  chrome: 123 << 16,
  edge: 123 << 16,
  firefox: 120 << 16,
  safari: (17 << 16) | (5 << 8),
};

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath ?? entry.path, entry.name));
}

function compileTypeScript() {
  const tsc = join(dirname(require.resolve("typescript/package.json")), "bin", "tsc");
  const result = spawnSync(
    process.execPath,
    [tsc, "-p", join(packageRoot, "tsconfig.build.json")],
    {
      stdio: "inherit",
    },
  );
  if (result.status !== 0) throw new Error(`tsc failed with exit code ${result.status}`);
}

async function bundleStyles() {
  const { code, warnings } = bundle({
    filename: join(srcDir, "styles", "index.css"),
    minify: false,
    targets: cssTargets,
  });
  for (const warning of warnings) console.warn(`css warning: ${warning.message}`);
  await writeFile(join(distDir, "styles.css"), `${BANNER}\n${code}`);
  // TypeScript checks side-effect imports by default since 6.0. This declaration lets
  // `import "@tim3399/mosaik/styles.css"` type-check without extra consumer configuration.
  await writeFile(join(distDir, "styles.css.d.ts"), "export {};\n");
}

async function addNoticeAndVerifyDirectives() {
  const sources = (await listFiles(srcDir)).filter(
    (file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file),
  );
  const problems = [];
  for (const source of sources) {
    const relativeSource = relative(srcDir, source);
    const output = join(distDir, relativeSource.replace(/\.tsx?$/, ".js"));
    const sourceIsClient = CLIENT_DIRECTIVE.test(await readFile(source, "utf8"));
    let code = await readFile(output, "utf8");
    const outputIsClient = CLIENT_DIRECTIVE.test(code);
    if (sourceIsClient !== outputIsClient) {
      problems.push(`${relativeSource.split(sep).join("/")}: "use client" directive not preserved`);
    }
    // Keep the directive as the first statement; the notice follows it.
    code = outputIsClient
      ? code.replace(CLIENT_DIRECTIVE, (directive) => `${directive}\n${BANNER}`)
      : `${BANNER}\n${code}`;
    await writeFile(output, code);
  }
  if (problems.length > 0) throw new Error(`Build verification failed:\n${problems.join("\n")}`);
  return sources.length;
}

async function build({ clean }) {
  const startedAt = Date.now();
  // Watch rebuilds overwrite in place, so a running dev server never sees an empty dist.
  if (clean) await rm(distDir, { recursive: true, force: true });
  compileTypeScript();
  await bundleStyles();
  const modules = await addNoticeAndVerifyDirectives();
  console.log(`built ${modules} modules and styles.css in ${Date.now() - startedAt} ms`);
}

if (process.argv.includes("--watch")) {
  let running = false;
  let queued = false;
  let timer;
  const rebuild = async () => {
    if (running) {
      queued = true;
      return;
    }
    running = true;
    try {
      await build({ clean: false });
    } catch (error) {
      console.error(`build failed: ${error.message}`);
    } finally {
      running = false;
      if (queued) {
        queued = false;
        await rebuild();
      }
    }
  };
  if (!process.argv.includes("--skip-initial")) await rebuild();
  watch(srcDir, { recursive: true }, (_event, filename) => {
    if (filename && /\.test\.tsx?$/.test(filename)) return;
    clearTimeout(timer);
    timer = setTimeout(rebuild, 150);
  });
  console.log("watching src for changes");
} else {
  await build({ clean: true });
}
