import { test, expect } from '@playwright/test';
import Appbar from './components/Appbar';

test('Should navigate to each main route', async ({ page }) => {
  const appbar = new Appbar(page);
  await page.goto('/');

  appbar.openDrawer();
  await page.getByRole('link', { name: 'Books' }).click();
  await expect(page).toHaveURL('/books');

  appbar.openDrawer();
  await page.getByRole('link', { name: 'Movies' }).click();
  await expect(page).toHaveURL('/movies');

  appbar.openDrawer();
  await page.getByRole('link', { name: 'Profile' }).click();
  await expect(page).toHaveURL('/profile');
});
