#!/usr/bin/env node
// Production preview of the built showcase (`npm run build` first). Used for manual checks and
// by the browser tests. Ready means the server answers with this launch's identity.
import { existsSync } from "node:fs";
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
  console.error(`[preview] ${hint}`);
  process.exit(1);
}
const { host: HOST, port: showcasePort, url: showcaseUrl } = config;
const launchId = process.env.MOSAIK_LAUNCH_ID || randomUUID();

if (!existsSync(join(showcaseDir, ".next", "BUILD_ID"))) {
  console.error('[preview] no production build found; run "npm run build" first');
  process.exit(1);
}

try {
  await assertPortFree(HOST, showcasePort);
} catch (error) {
  console.error(`[preview] ${error.message}`);
  process.exit(1);
}

const children = [
  startOwnedProcess(
    "showcase",
    process.execPath,
    [nextBin, "start", "--port", String(showcasePort), "--hostname", HOST],
    { cwd: showcaseDir, env: { ...process.env, MOSAIK_LAUNCH_ID: launchId } },
  ),
];
const shutdown = handleShutdown(children);

try {
  const health = await waitForReady({
    url: `${showcaseUrl}/api/health`,
    isReady: (body) => body.launchId === launchId,
    deadlineMs: 60_000,
    watched: children,
  });
  const revision = `${health.revision}${health.dirty ? " (dirty)" : ""}`;
  console.log(
    `[preview] ready: ${showcaseUrl} · ${health.mode} · @tim3399/mosaik ${health.version} · ${revision}`,
  );
} catch (error) {
  console.error(`[preview] ${error.message}`);
  await shutdown(1);
}
