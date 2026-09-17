import { expect, type Page, test } from "@playwright/test";

// The same checks run against every consumer fixture, built from the packed tarball.

function collectBrowserProblems(page: Page): string[] {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      problems.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => problems.push(`page error: ${error.message}`));
  return problems;
}

test("package styles apply with valid colors, including the default without a mode scope", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const button = page.getByRole("button", { name: "Create project" });
  await expect(button).toHaveClass(/mosaik-button/);
  const styles = await button.evaluate((element) => {
    const computed = getComputedStyle(element);
    return { background: computed.backgroundColor, minHeight: computed.minHeight };
  });
  // Unresolvable color tokens would compute to transparent.
  expect(styles.background).not.toBe("rgba(0, 0, 0, 0)");
  expect(styles.minHeight).toBe("40px");

  const darkScope = await page
    .getByRole("button", { name: "Dark scope" })
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(darkScope).not.toBe("rgba(0, 0, 0, 0)");
  expect(darkScope).not.toBe(styles.background);
});

test("text fields keep their accessible name and description", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("textbox", { name: "Project name" })).toHaveAccessibleDescription(
    "Shown in the navigation.",
  );
});

test("a stateful component rendered directly by the page becomes interactive", async ({ page }) => {
  await page.goto("/");

  const input = page.getByRole("textbox", { name: "Brand color", exact: true });
  // Playwright maps the native color input to the textbox role; its name joins both labels.
  const picker = page.getByRole("textbox", { name: "Brand color Pick color", exact: true });
  await expect(picker).toHaveValue("#15803d");
  await expect(async () => {
    await input.fill("#ABCDEF");
    await expect(picker).toHaveValue("#abcdef", { timeout: 1000 });
  }).toPass();
});

test("client components respond after hydration without console errors", async ({ page }) => {
  const problems = collectBrowserProblems(page);
  await page.goto("/");

  const colorInput = page.getByRole("textbox", { name: "Accent color", exact: true });
  await expect(async () => {
    await colorInput.fill("#15803D");
    await expect(page.getByTestId("selected-color")).toHaveText("#15803d", { timeout: 1000 });
  }).toPass();

  await page.getByRole("button", { name: "Count clicks" }).click();
  await expect(page.getByTestId("click-count")).toHaveText("1");
  expect(problems).toEqual([]);
});
