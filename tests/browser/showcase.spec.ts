import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

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

test("serves the production build started for this run", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  const health = await response.json();
  expect(health.launchId).toBe(process.env.MOSAIK_LAUNCH_ID);
  expect(health.mode).toBe("production");
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`renders without browser errors or axe violations in ${colorScheme} mode`, async ({
    page,
  }) => {
    const problems = collectBrowserProblems(page);
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "mosaik" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create project" })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
    expect(problems).toEqual([]);
  });
}

// Reduced motion sets the transition duration token to 0 ms, so computed colors settle at once.
test("resolves colors for the active color scheme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("/");
  const primary = page.getByRole("button", { name: "Create project" });
  const background = () => primary.evaluate((element) => getComputedStyle(element).backgroundColor);

  const light = await background();
  await page.emulateMedia({ colorScheme: "dark" });
  const dark = await background();

  expect(light).not.toBe("rgba(0, 0, 0, 0)");
  expect(dark).not.toBe("rgba(0, 0, 0, 0)");
  expect(dark).not.toBe(light);
});

test("mode scopes resolve colors per subtree, independent of the page mode", async ({ page }) => {
  const background = (name: string) =>
    page
      .getByRole("button", { name })
      .evaluate((element) => getComputedStyle(element).backgroundColor);

  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("/");
  const pageLight = await background("Create project");
  await page.emulateMedia({ colorScheme: "dark" });
  const pageDark = await background("Create project");
  expect(pageDark).not.toBe(pageLight);

  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    expect(await background("Light scope")).toBe(pageLight);
    expect(await background("Dark scope")).toBe(pageDark);
  }
});

test("server-rendered fields expose labels, descriptions and errors", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("textbox", { name: "Project name" })).toHaveAccessibleDescription(
    "Shown in the navigation of every tool.",
  );
  const link = page.getByRole("textbox", { name: "Download link" });
  await expect(link).toHaveAttribute("aria-invalid", "true");
  await expect(link).toHaveAccessibleDescription(
    "Enter a complete link that starts with https://.",
  );
});

test("client components hydrate and respond to input", async ({ page }) => {
  const problems = collectBrowserProblems(page);
  await page.goto("/");

  // Exact name: Chromium also exposes the color picker as a textbox named "Accent color Pick color".
  const colorInput = page.getByRole("textbox", { name: "Accent color", exact: true });
  const selectedColor = page.getByTestId("selected-color");
  // Input before hydration can be discarded by React; retry until the island reacts.
  await expect(async () => {
    await colorInput.fill("#15803D");
    await expect(selectedColor).toHaveText("#15803d", { timeout: 1000 });
  }).toPass();

  await page.getByRole("button", { name: "Count clicks" }).click();
  await expect(page.getByTestId("click-count")).toHaveText("1 click");
  expect(problems).toEqual([]);
});

test("fits a 320 px wide viewport without horizontal scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "mosaik" })).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
