import { resolve } from "node:path";
import { defineConfig, devices } from "@playwright/test";

// Driven by run.mjs, which builds and serves each consumer and passes its URL.
const consumerUrl = process.env.MOSAIK_CONSUMER_URL;
const consumerName = process.env.MOSAIK_CONSUMER_NAME ?? "consumer";
if (!consumerUrl)
  throw new Error("MOSAIK_CONSUMER_URL is not set; run tests/package-consumer/run.mjs");

const repositoryRoot = resolve(import.meta.dirname, "..", "..");

export default defineConfig({
  testDir: ".",
  testMatch: "consumer.spec.ts",
  forbidOnly: Boolean(process.env.CI),
  outputDir: resolve(repositoryRoot, "test-results", "package-consumer", consumerName),
  reporter: "list",
  use: {
    baseURL: consumerUrl,
    trace: "retain-on-failure",
  },
  projects: [{ name: consumerName, use: { ...devices["Desktop Chrome"] } }],
});
