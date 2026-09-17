import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = join(packageRoot, "..", "..");

describe("package metadata", () => {
  it("ships a license file identical to the repository license", () => {
    const packageLicense = readFileSync(join(packageRoot, "LICENSE.md"));
    const repositoryLicense = readFileSync(join(repositoryRoot, "LICENSE.md"));
    expect(packageLicense.equals(repositoryLicense)).toBe(true);
  });

  it("declares the license file and the stylesheet export", () => {
    const manifest = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));
    expect(manifest.license).toBe("SEE LICENSE IN LICENSE.md");
    expect(manifest.files).toEqual(expect.arrayContaining(["dist", "LICENSE.md", "README.md"]));
    expect(manifest.exports["./styles.css"]).toEqual({
      types: "./dist/styles.css.d.ts",
      default: "./dist/styles.css",
    });
    expect(manifest.sideEffects).toEqual(["*.css"]);
  });
});
