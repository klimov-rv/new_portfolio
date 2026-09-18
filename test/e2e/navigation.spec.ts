import { expect, test } from '@playwright/test';

test('opens the first project from the portfolio', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.global-loader')).toBeHidden({ timeout: 15_000 });
  await page.locator('.project-card').first().click();

  await expect(page).toHaveURL(/\/project\/ege-kritsky$/);
  await expect(page.locator('h1')).toHaveText('ЕГЭ / Крицкий');
});
