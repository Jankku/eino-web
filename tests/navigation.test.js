import { test, expect } from '@playwright/test';

test('Should navigate to each main route', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Books' }).click();
  await expect(page).toHaveURL('/books');

  await page.getByRole('link', { name: 'Movies' }).click();
  await expect(page).toHaveURL('/movies');

  await page.getByRole('link', { name: 'Profile' }).click();
  await expect(page).toHaveURL('/profile');
});
