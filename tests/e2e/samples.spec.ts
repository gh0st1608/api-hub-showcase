import { expect, test } from "@playwright/test";

test.describe("Catalog showcase", () => {
  test("navigates to catalog page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/catalog/);
    await expect(
      page.getByRole("heading", { name: /catalogo central de proyectos/i })
    ).toBeVisible();
  });

  test("shows manifest-driven project and design cards", async ({ page }) => {
    await page.goto("/catalog");
    await expect(page.getByText(/foodstore sdc/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /abrir proyecto/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /ver documentacion/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /abrir yaml/i }).first()
    ).toBeVisible();
  });
});
