import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import AuthPage from './pages/AuthPage';

test.describe('Register', () => {
  test.use({ storageState: undefined });

  test('Should register new user', async ({ page }) => {
    const authPage = new AuthPage(page);
    const username = faker.internet.password();
    const password = faker.internet.password();

    await authPage.registerUser(username, password);
    await expect(page).toHaveURL('/login');
  });

  test('Should not register new user with invalid credentials', async ({ page }) => {
    const authPage = new AuthPage(page);

    await authPage.registerUser('a', 'a');
    await expect(page).toHaveURL('/register');
    await expect(page.locator('input#username')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('input#password')).toHaveAttribute('aria-invalid', 'true');
  });
});

test.describe('Login', () => {
  test.use({ storageState: undefined });

  test('Should successfully login and log-out user', async ({ page }) => {
    const authPage = new AuthPage(page);
    const username = faker.internet.password();
    const password = faker.internet.password();

    await authPage.registerUser(username, password);
    await expect(page).toHaveURL('/login');
    await authPage.loginUser(username, password);
    await expect(page).toHaveURL('/books');
    await page.getByRole('button', { name: 'Log out' }).click();
    await expect(page).toHaveURL('/');
  });

  test('Should not login user with incorrect credentials', async ({ page }) => {
    const authPage = new AuthPage(page);
    const username = faker.internet.password();
    const password = faker.internet.password();

    await authPage.loginUser(username, password);
    await expect(page).toHaveURL('/login');
    await expect(page.locator('[id=errorText]')).toContainText(/Incorrect username or password/);
  });
});
