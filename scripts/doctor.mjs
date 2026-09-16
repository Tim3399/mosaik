#!/usr/bin/env node
// Read-only environment report. Exits nonzero when a requirement is not met.
// It never installs, builds or writes files.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const results = [];

function report(status, name, detail, fix) {
  results.push({ status, name, detail, fix });
}

function run(command, args) {
  // npm is a .cmd shim on Windows and needs a shell there.
  return execFileSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    shell: process.platform === "win32",
  }).trim();
}

function parseVersion(text) {
  const match = /(\d+)\.(\d+)\.(\d+)/.exec(text);
  return match ? match.slice(1, 4).map(Number) : null;
}

function compare(a, b) {
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] - b[index];
  }
  return 0;
}

const rootManifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

// Node: exact pin in .nvmrc, supported development range in engines.
const pinnedNode = readFileSync(join(root, ".nvmrc"), "utf8").trim();
const actualNode = process.versions.node;
if (actualNode === pinnedNode) {
  report("ok", "Node.js", `${actualNode} (pinned in .nvmrc)`);
} else {
  const actual = parseVersion(actualNode);
  const inRange = actual[0] === 22 && compare(actual, [22, 22, 0]) >= 0;
  report(
    inRange ? "warn" : "fail",
    "Node.js",
    `${actualNode}; the release pin is ${pinnedNode}, development supports ${rootManifest.engines.node}`,
    `Install Node.js ${pinnedNode}, for example with "nvm install ${pinnedNode}".`,
  );
}

// npm: exact pin in packageManager, supported range in engines.
const pinnedNpm = rootManifest.packageManager.replace(/^npm@/, "");
try {
  const actualNpm = run("npm", ["--version"]);
  if (actualNpm === pinnedNpm) {
    report("ok", "npm", `${actualNpm} (pinned in package.json packageManager)`);
  } else {
    const actual = parseVersion(actualNpm);
    const inRange = actual && compare(actual, [10, 9, 0]) >= 0 && actual[0] < 12;
    report(
      inRange ? "warn" : "fail",
      "npm",
      `${actualNpm}; the release pin is ${pinnedNpm}, development supports ${rootManifest.engines.npm}`,
      `Install npm ${pinnedNpm} with "npm install --global npm@${pinnedNpm}".`,
    );
  }
} catch (error) {
  report("fail", "npm", `not runnable: ${error.message}`, "Install Node.js with its bundled npm.");
}

// Git provides the source revision embedded in builds.
try {
  report("ok", "Git", run("git", ["--version"]));
} catch {
  report("warn", "Git", "not found; builds will report an unknown source revision", "Install Git.");
}

// Installed dependencies must match the committed lockfile.
if (!existsSync(join(root, "node_modules"))) {
  report("fail", "Dependencies", "node_modules is missing", 'Run "npm ci".');
} else {
  try {
    run("npm", ["ls", "--depth=1"]);
    report("ok", "Dependencies", "installed tree matches package.json and package-lock.json");
  } catch (error) {
    const firstProblem = `${error.stdout ?? ""}${error.stderr ?? ""}`
      .split("\n")
      .find((line) => /missing|invalid|extraneous|ERR/i.test(line));
    report("fail", "Dependencies", firstProblem?.trim() ?? "npm ls failed", 'Run "npm ci".');
  }
}

// Browser tests need the Chromium build that belongs to the installed Playwright version.
const browsersManifest = join(root, "node_modules", "playwright-core", "browsers.json");
if (existsSync(browsersManifest)) {
  const { browsers } = JSON.parse(readFileSync(browsersManifest, "utf8"));
  const chromium = browsers.find((browser) => browser.name === "chromium");
  const cacheRoot =
    process.env.PLAYWRIGHT_BROWSERS_PATH ||
    (process.platform === "win32"
      ? join(process.env.LOCALAPPDATA ?? join(homedir(), "AppData", "Local"), "ms-playwright")
      : process.platform === "darwin"
        ? join(homedir(), "Library", "Caches", "ms-playwright")
        : join(homedir(), ".cache", "ms-playwright"));
  const chromiumDirectory = join(cacheRoot, `chromium-${chromium.revision}`);
  if (existsSync(chromiumDirectory)) {
    report("ok", "Playwright Chromium", `revision ${chromium.revision}`);
  } else {
    report(
      "warn",
      "Playwright Chromium",
      `revision ${chromium.revision} is not installed; browser tests cannot run`,
      'Run "npx playwright install chromium".',
    );
  }
}

const symbols = { ok: "ok  ", warn: "WARN", fail: "FAIL" };
for (const { status, name, detail, fix } of results) {
  console.log(`${symbols[status]} ${name}: ${detail}`);
  if (fix && status !== "ok") console.log(`     -> ${fix}`);
}

const failures = results.filter((result) => result.status === "fail").length;
const warnings = results.filter((result) => result.status === "warn").length;
console.log(`\n${failures} failing, ${warnings} warning(s).`);
process.exitCode = failures > 0 ? 1 : 0;
