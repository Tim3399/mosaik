import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import type { NextConfig } from "next";

// Build identity, embedded at build time (or dev-server start) and shown in the page footer.
function git(args: string[]): string | null {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

const require = createRequire(join(process.cwd(), "package.json"));
const library = JSON.parse(readFileSync(require.resolve("@tim3399/mosaik/package.json"), "utf8"));
const revision = git(["rev-parse", "--short=12", "HEAD"]);
const dirty = revision !== null && git(["status", "--porcelain"]) !== "";

const nextConfig: NextConfig = {
  env: {
    MOSAIK_BUILD_VERSION: String(library.version),
    MOSAIK_BUILD_REVISION: revision ?? "unknown",
    MOSAIK_BUILD_DIRTY: String(dirty),
    MOSAIK_BUILD_MODE: process.env.NODE_ENV === "production" ? "production" : "development",
  },
};

export default nextConfig;
