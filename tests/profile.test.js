import { faker } from '@faker-js/faker';
import { test, expect } from '@playwright/test';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';

test.describe('Profile', () => {
  test('Should generate profile image and copy link', async ({ page }) => {
    await page.goto('/profile');
    const profilePage = new ProfilePage(page);

    await profilePage.createRandomBook();
    await profilePage.createRandomMovie();

    await page.getByRole('button', { name: 'Share' }).click();
    const shareDialog = page.getByRole('dialog');
    await expect(shareDialog).toBeVisible();
    await page.getByRole('button', { name: 'Copy link', disabled: false }).click();
    const shareUrl = await page.evaluate(() => navigator.clipboard.readText());
    expect(shareUrl).toMatch(/\/share\/[a-z0-9-]+/);
  });
});

test.describe('Profile - Delete account', () => {
  test.use({ storageState: undefined });

  test('Should delete account', async ({ page }) => {
    const username = faker.internet.userName();
    const password = faker.internet.password();
    const authPage = new AuthPage(page);
    await authPage.registerUser(username, password);
    await expect(page).toHaveURL('/login');
    await authPage.loginUser(username, password);
    await expect(page).toHaveURL('/books');

    await page.goto('/profile');
    await page.getByRole('button', { name: 'Delete account' }).click();
    const deleteDialog = page.getByRole('dialog');
    await expect(deleteDialog).toBeVisible();
    await deleteDialog.getByLabel('Confirm password').fill(password);
    await deleteDialog.getByRole('button', { name: 'Delete account' }).click();
    await expect(page).toHaveURL('/');
  });
});
