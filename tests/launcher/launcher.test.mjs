// Failure cases and cleanup of the local launcher (scripts/dev.mjs), run with `node --test`.
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:net";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const isWindows = process.platform === "win32";

function startLauncher(env) {
  const child = spawn(process.execPath, [join(root, "scripts", "dev.mjs")], {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.output = "";
  child.stdout.on("data", (chunk) => {
    child.output += chunk;
  });
  child.stderr.on("data", (chunk) => {
    child.output += chunk;
  });
  return child;
}

function waitForExit(child, timeoutMs) {
  if (child.exitCode !== null) return Promise.resolve(child.exitCode);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`no exit within ${timeoutMs} ms`)), timeoutMs);
    child.once("exit", (code) => {
      clearTimeout(timer);
      resolve(code);
    });
  });
}

async function waitForOutput(child, pattern, timeoutMs) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (pattern.test(child.output)) return;
    if (child.exitCode !== null) break;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`output did not match ${pattern}:\n${child.output}`);
}

function listen(server, port) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen({ host: "127.0.0.1", port }, () => resolve(server.address().port));
  });
}

async function freePort() {
  const server = createServer();
  const port = await listen(server, 0);
  await new Promise((resolve) => server.close(resolve));
  return port;
}

async function portIsReleased(port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const probe = createServer();
    const bound = await listen(probe, port).then(
      () => true,
      () => false,
    );
    if (bound) {
      await new Promise((resolve) => probe.close(resolve));
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return false;
}

test("fails clearly when the port is already in use", async () => {
  const blocker = createServer();
  const port = await listen(blocker, 0);
  try {
    const launcher = startLauncher({ MOSAIK_SHOWCASE_PORT: String(port) });
    assert.equal(await waitForExit(launcher, 30_000), 1);
    assert.match(launcher.output, new RegExp(`Port ${port} on 127\\.0\\.0\\.1 is already in use`));
  } finally {
    await new Promise((resolve) => blocker.close(resolve));
  }
});

test("rejects an invalid port override before starting anything", async () => {
  const launcher = startLauncher({ MOSAIK_SHOWCASE_PORT: "70000" });
  assert.equal(await waitForExit(launcher, 30_000), 1);
  assert.match(launcher.output, /MOSAIK_SHOWCASE_PORT must be an integer between 1 and 65535/);
});

test("starts on an alternate port, proves its identity and releases the port when stopped", {
  timeout: 240_000,
}, async () => {
  const port = await freePort();
  const launcher = startLauncher({ MOSAIK_SHOWCASE_PORT: String(port) });
  try {
    await waitForOutput(
      launcher,
      new RegExp(`\\[launcher\\] ready: http://127\\.0\\.0\\.1:${port} · development`),
      180_000,
    );
    const health = await (await fetch(`http://127.0.0.1:${port}/api/health`)).json();
    assert.equal(health.service, "mosaik-showcase");
    assert.equal(health.mode, "development");
  } finally {
    if (isWindows) {
      // Node cannot deliver Ctrl+C to a process tree on Windows; end the tree instead.
      spawnSync("taskkill", ["/pid", String(launcher.pid), "/T", "/F"], { stdio: "ignore" });
      await waitForExit(launcher, 30_000);
    } else {
      launcher.kill("SIGINT");
      assert.equal(await waitForExit(launcher, 30_000), 0, launcher.output);
    }
  }
  assert.ok(await portIsReleased(port, 15_000), `port ${port} is still in use after stopping`);
});
