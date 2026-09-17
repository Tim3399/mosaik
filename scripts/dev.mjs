#!/usr/bin/env node
// Complete local development start: builds the library once, rebuilds it on changes and runs
// the showcase dev server. Ready means the showcase answers with this launch's identity.
// It never installs dependencies or changes versions.
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadShowcaseConfig } from "./config.mjs";
import { assertPortFree, handleShutdown, startOwnedProcess, waitForReady } from "./processes.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const showcaseDir = join(root, "apps", "showcase");
let config;
let nextBin;
try {
  config = loadShowcaseConfig();
  nextBin = createRequire(join(showcaseDir, "package.json")).resolve("next/dist/bin/next");
} catch (error) {
  const hint =
    error.code === "MODULE_NOT_FOUND" ? 'Next.js is not installed; run "npm ci".' : error.message;
  console.error(`[launcher] ${hint}`);
  process.exit(1);
}
const { host: HOST, port: showcasePort, url: showcaseUrl } = config;
const libraryBuild = join(root, "packages", "ui", "scripts", "build.mjs");
const launchId = randomUUID();

try {
  await assertPortFree(HOST, showcasePort);
} catch (error) {
  console.error(`[launcher] ${error.message}`);
  process.exit(1);
}

console.log("[launcher] building @tim3399/mosaik");
const initialBuild = spawnSync(process.execPath, [libraryBuild], { stdio: "inherit" });
if (initialBuild.status !== 0) {
  console.error("[launcher] the library build failed; fix it and start again");
  process.exit(1);
}

const children = [
  startOwnedProcess("ui", process.execPath, [libraryBuild, "--watch", "--skip-initial"]),
  startOwnedProcess(
    "showcase",
    process.execPath,
    [nextBin, "dev", "--port", String(showcasePort), "--hostname", HOST],
    { cwd: showcaseDir, env: { ...process.env, MOSAIK_LAUNCH_ID: launchId } },
  ),
];
const shutdown = handleShutdown(children);

try {
  const health = await waitForReady({
    url: `${showcaseUrl}/api/health`,
    isReady: (body) => body.launchId === launchId,
    deadlineMs: 120_000,
    watched: children,
  });
  const revision = `${health.revision}${health.dirty ? " (dirty)" : ""}`;
  console.log(
    `[launcher] ready: ${showcaseUrl} · ${health.mode} · @tim3399/mosaik ${health.version} · ${revision}`,
  );
  console.log("[launcher] library changes rebuild automatically; press Ctrl+C to stop");
} catch (error) {
  console.error(`[launcher] ${error.message}`);
  await shutdown(1);
}
