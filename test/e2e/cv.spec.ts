import { expect, test } from '@playwright/test';

test('renders the CV content and SEO metadata', async ({ page }) => {
  await page.goto('/cv');

  await expect(page.locator('.cv-content')).toContainText('Климов Роман');
  await expect(page).toHaveTitle(/Климов Роман|KlimovProject/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /.+/,
  );
});
