// Process helpers for the local launchers: owned child processes with prefixed logs, port and
// readiness checks, and cleanup that only touches processes this launcher started.
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:net";

const isWindows = process.platform === "win32";

export function assertPortFree(host, port) {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once("error", (error) => {
      reject(
        error.code === "EADDRINUSE"
          ? new Error(
              `Port ${port} on ${host} is already in use. Stop that process or choose another ` +
                "port, for example MOSAIK_SHOWCASE_PORT=3320.",
            )
          : error,
      );
    });
    probe.listen({ host, port, exclusive: true }, () => probe.close(resolve));
  });
}

function pipeWithPrefix(stream, target, prefix) {
  let buffer = "";
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    buffer += chunk;
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";
    for (const line of lines) target.write(`${prefix} ${line}\n`);
  });
  stream.on("end", () => {
    if (buffer) target.write(`${prefix} ${buffer}\n`);
  });
}

export function startOwnedProcess(name, command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: options.cwd,
    env: options.env ?? process.env,
    stdio: ["ignore", "pipe", "pipe"],
    // A separate process group lets POSIX cleanup reach grandchildren (e.g. Next.js workers).
    detached: !isWindows,
    windowsHide: true,
  });
  const prefix = `[${name}]`;
  pipeWithPrefix(child.stdout, process.stdout, prefix);
  pipeWithPrefix(child.stderr, process.stderr, prefix);
  child.displayName = name;
  return child;
}

function isRunning(child) {
  return child.exitCode === null && child.signalCode === null;
}

export async function stopOwnedProcess(child, graceMs = 5000) {
  if (!isRunning(child)) return;
  const exited = new Promise((resolve) => child.once("exit", resolve));
  if (isWindows) {
    // Console processes on Windows cannot be asked to close; end the owned tree directly.
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {}
  }
  const timedOut = await Promise.race([
    exited.then(() => false),
    new Promise((resolve) => setTimeout(() => resolve(true), graceMs)),
  ]);
  if (timedOut && isRunning(child)) {
    if (isWindows) {
      spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    } else {
      try {
        process.kill(-child.pid, "SIGKILL");
      } catch {}
    }
    await exited;
  }
}

/**
 * Polls `url` until `isReady(json)` holds. Fails when the deadline passes or when one of the
 * watched processes exits first, so an early crash is reported instead of a timeout.
 */
export async function waitForReady({ url, isReady, deadlineMs, watched }) {
  const startedAt = Date.now();
  let lastProblem = "no response yet";
  while (Date.now() - startedAt < deadlineMs) {
    const exited = watched.find((child) => !isRunning(child));
    if (exited) {
      throw new Error(`${exited.displayName} exited early with code ${exited.exitCode}`);
    }
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (response.ok) {
        const body = await response.json();
        if (isReady(body)) return body;
        lastProblem = "a server answered, but it is not the process started by this launcher";
      } else {
        lastProblem = `HTTP ${response.status}`;
      }
    } catch (error) {
      lastProblem = error.cause?.code ?? error.message;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Not ready after ${deadlineMs} ms at ${url}: ${lastProblem}`);
}

/** Stops every owned process on Ctrl+C, termination or failure, then exits. */
export function handleShutdown(children) {
  let stopping = false;
  const shutdown = async (code) => {
    if (stopping) return;
    stopping = true;
    await Promise.all(children.map((child) => stopOwnedProcess(child)));
    process.exit(code);
  };
  process.on("SIGINT", () => shutdown(0));
  process.on("SIGTERM", () => shutdown(0));
  for (const child of children) {
    child.once("exit", (code) => {
      if (!stopping) {
        console.error(`[launcher] ${child.displayName} exited unexpectedly with code ${code}`);
        shutdown(1);
      }
    });
  }
  return shutdown;
}
