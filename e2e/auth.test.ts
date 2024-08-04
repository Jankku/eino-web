import { test, expect } from '@playwright/test';
import AuthPage from './pages/AuthPage';
import Appbar from './components/Appbar';
import { generatePassword, generateUsername } from './util';

test.describe('Register', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Should register new user', async ({ page }) => {
    const authPage = new AuthPage(page);
    const username = generateUsername();
    const password = generatePassword();

    await authPage.fillRegisterForm(username, password);
    await authPage.clickRegisterButton();
    await expect(page).toHaveURL('/login');
  });

  test('Should not register new user with invalid credentials', async ({ page }) => {
    const authPage = new AuthPage(page);

    await authPage.fillRegisterForm('a', 'a');
    await authPage.expectPasswordIsWeak();
  });
});

test.describe('Login', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Should successfully login and log-out user', async ({ page }) => {
    const authPage = new AuthPage(page);
    const appbar = new Appbar(page);
    const username = generateUsername();
    const password = generatePassword();

    await authPage.fillRegisterForm(username, password);
    await authPage.clickRegisterButton();
    await expect(page).toHaveURL('/login');
    await authPage.loginUser(username, password);
    await expect(page).toHaveURL('/books');

    appbar.openDrawer();
    await page.getByRole('button', { name: 'Log out' }).click();
    await expect(page).toHaveURL('/');
  });

  test('Should not login user with incorrect credentials', async ({ page }) => {
    const authPage = new AuthPage(page);
    const username = generateUsername();
    const password = generatePassword();

    await authPage.loginUser(username, password);
    await expect(page).toHaveURL('/login');
    await expect(page.locator('[id=errorText]')).toContainText(/Incorrect username or password/);
  });
});
