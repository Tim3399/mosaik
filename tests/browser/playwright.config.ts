import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { defineConfig, devices } from "@playwright/test";
import { loadShowcaseConfig } from "../../scripts/config.mjs";

const repositoryRoot = resolve(import.meta.dirname, "..", "..");
const showcase = loadShowcaseConfig();
const allBrowsers = Boolean(process.env.CI) || process.env.MOSAIK_ALL_BROWSERS === "1";

// The workers inherit this id, so the tests can prove they talk to the server started here.
process.env.MOSAIK_LAUNCH_ID ||= randomUUID();

export default defineConfig({
  testDir: ".",
  forbidOnly: Boolean(process.env.CI),
  outputDir: resolve(repositoryRoot, "test-results", "browser"),
  reporter: process.env.CI
    ? [
        ["list"],
        ["html", { open: "never", outputFolder: resolve(repositoryRoot, "playwright-report") }],
      ]
    : "list",
  use: {
    baseURL: showcase.url,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    ...(allBrowsers
      ? [
          { name: "firefox", use: { ...devices["Desktop Firefox"] } },
          { name: "webkit", use: { ...devices["Desktop Safari"] } },
        ]
      : []),
  ],
  // Production preview of the built showcase; run "npm run build" first.
  webServer: {
    command: "node scripts/serve.mjs",
    cwd: repositoryRoot,
    url: `${showcase.url}/api/health`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: { MOSAIK_LAUNCH_ID: process.env.MOSAIK_LAUNCH_ID },
    stdout: "pipe",
    stderr: "pipe",
  },
});
