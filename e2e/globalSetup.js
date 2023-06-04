import { chromium, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import AuthPage from './pages/AuthPage';

/**
 * @param {import('@playwright/test').FullConfig} config
 */
async function globalSetup(config) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL: config.projects[0].use.baseURL });
  const authPage = new AuthPage(page);
  const username = faker.internet.password();
  const password = faker.internet.password();

  await authPage.registerUser(username, password);
  await expect(page).toHaveURL('/login');

  await authPage.loginUser(username, password);
  await expect(page).toHaveURL('/books');

  await page.context().storageState({ path: './e2e/storageState.json' });
  await browser.close();
}

export default globalSetup;
