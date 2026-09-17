#!/usr/bin/env node
// Package acceptance: packs @tim3399/mosaik, checks the artifact, installs the tarball into
// isolated consumer apps outside the workspace (Next.js App Router and Vite + React), builds
// them for production and runs the browser checks against the served builds.
//
// Usage: node tests/package-consumer/run.mjs [next-app] [vite-app]
import { spawn, spawnSync } from "node:child_process";
import { cp, lstat, mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { stopOwnedProcess } from "../../scripts/processes.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const packageDir = join(root, "packages", "ui");
const isWindows = process.platform === "win32";
const allFixtures = ["next-app", "vite-app"];
const selected = process.argv.slice(2);
const fixtures = selected.length > 0 ? selected : allFixtures;

for (const name of fixtures) {
  if (!allFixtures.includes(name)) {
    console.error(`Unknown fixture "${name}". Known: ${allFixtures.join(", ")}`);
    process.exit(2);
  }
}

function log(message) {
  console.log(`[package] ${message}`);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    env: { ...process.env, ...options.env },
    stdio: options.capture ? ["ignore", "pipe", "inherit"] : "inherit",
    encoding: "utf8",
    // npm is a .cmd shim on Windows; arguments here never contain spaces or quotes.
    shell: options.shell ?? false,
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`);
  }
  return result.stdout;
}

function npm(args, options = {}) {
  // Inside `npm run`, npm_execpath points to npm's CLI script, which avoids the Windows shim.
  const npmCli = process.env.npm_execpath;
  if (npmCli?.endsWith(".js")) return run(process.execPath, [npmCli, ...args], options);
  return run("npm", args, { ...options, shell: isWindows });
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen({ host: "127.0.0.1", port: 0 }, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitForHttp(url, child, deadlineMs) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < deadlineMs) {
    if (child.exitCode !== null) throw new Error(`server exited early with code ${child.exitCode}`);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`no response from ${url} within ${deadlineMs} ms`);
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath ?? entry.path, entry.name));
}

// Reports, per file type, how many built client assets still carry the license comment.
// Informational: bundlers decide whether to keep legal comments (see docs/decisions.md, L-01).
async function describeNoticeRetention(directory) {
  const counts = {};
  for (const file of await listFiles(directory)) {
    const extension = [".js", ".css"].find((candidate) => file.endsWith(candidate));
    if (!extension) continue;
    counts[extension] ??= { retained: 0, total: 0 };
    counts[extension].total += 1;
    if ((await readFile(file, "utf8")).includes("Required Notice:")) {
      counts[extension].retained += 1;
    }
  }
  return Object.entries(counts)
    .map(([extension, { retained, total }]) => `${extension} ${retained}/${total}`)
    .join(", ");
}

const consumers = {
  "next-app": {
    serve: (appDir, port) => [
      join(appDir, "node_modules", "next", "dist", "bin", "next"),
      "start",
      "--port",
      String(port),
      "--hostname",
      "127.0.0.1",
    ],
    clientAssets: (appDir) => join(appDir, ".next", "static"),
  },
  "vite-app": {
    serve: (appDir, port) => [
      join(appDir, "node_modules", "vite", "bin", "vite.js"),
      "preview",
      "--port",
      String(port),
      "--strictPort",
      "--host",
      "127.0.0.1",
    ],
    clientAssets: (appDir) => join(appDir, "dist"),
  },
};

const workDir = await mkdtemp(join(tmpdir(), "mosaik-consumer-"));
const failures = [];
try {
  log("building the library");
  run(process.execPath, [join(packageDir, "scripts", "build.mjs")]);

  log("packing the library");
  const packed = JSON.parse(
    npm(["pack", "--workspace", "@tim3399/mosaik", "--pack-destination", workDir, "--json"], {
      capture: true,
    }),
  )[0];
  const tarball = join(workDir, packed.filename);
  const packedFiles = packed.files.map((file) => file.path);
  const required = ["package.json", "LICENSE.md", "README.md", "dist/index.js", "dist/index.d.ts"];
  const missing = required
    .concat("dist/styles.css", "dist/styles.css.d.ts")
    .filter((file) => !packedFiles.includes(file));
  const unexpected = packedFiles.filter((file) => /^(src|test|scripts)\//.test(file));
  if (missing.length > 0 || unexpected.length > 0) {
    throw new Error(
      `tarball content: missing [${missing.join(", ")}], unexpected [${unexpected.join(", ")}]`,
    );
  }
  log(`tarball ${packed.filename}: ${packedFiles.length} files, ${packed.size} bytes`);

  log("publint");
  npm(["exec", "--", "publint", "run", relative(root, packageDir), "--strict"]);
  log("Are the Types Wrong (ESM consumers)");
  npm(["exec", "--", "attw", tarball, "--profile", "esm-only"]);

  for (const name of fixtures) {
    const appDir = join(workDir, name);
    let server;
    try {
      log(`${name}: installing locked dependencies and the tarball`);
      await cp(join(here, "fixtures", name), appDir, { recursive: true });
      npm(["ci", "--no-audit", "--no-fund"], { cwd: appDir });
      npm(["install", "--no-save", "--no-audit", "--no-fund", tarball], { cwd: appDir });
      const installed = await lstat(join(appDir, "node_modules", "@tim3399", "mosaik"));
      if (installed.isSymbolicLink())
        throw new Error("the package resolved to a link, not the tarball");

      log(`${name}: production build`);
      npm(["run", "build"], { cwd: appDir });

      const port = await freePort();
      const url = `http://127.0.0.1:${port}`;
      server = spawn(process.execPath, consumers[name].serve(appDir, port), {
        cwd: appDir,
        stdio: "ignore",
        detached: !isWindows,
        windowsHide: true,
      });
      server.displayName = `${name} server`;
      await waitForHttp(url, server, 60_000);

      log(`${name}: browser checks at ${url}`);
      run(
        process.execPath,
        [
          join(root, "node_modules", "@playwright", "test", "cli.js"),
          "test",
          "--config",
          join(here, "playwright.config.ts"),
        ],
        { env: { MOSAIK_CONSUMER_URL: url, MOSAIK_CONSUMER_NAME: name } },
      );

      const retention = await describeNoticeRetention(consumers[name].clientAssets(appDir));
      log(`${name}: client assets with the license comment: ${retention}`);
      log(`${name}: passed`);
    } catch (error) {
      failures.push(`${name}: ${error.message}`);
      console.error(`[package] ${name}: FAILED: ${error.message}`);
    } finally {
      if (server) await stopOwnedProcess(server);
    }
  }
} catch (error) {
  failures.push(error.message);
  console.error(`[package] FAILED: ${error.message}`);
} finally {
  await rm(workDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 });
}

if (failures.length > 0) {
  console.error(`[package] ${failures.length} failure(s):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
log(`all consumers passed: ${fixtures.join(", ")}`);
