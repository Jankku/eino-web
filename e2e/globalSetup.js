import { chromium, expect } from '@playwright/test';
import AuthPage from './pages/AuthPage';
import { generatePassword, generateUsername } from './util';

/**
 * @param {import('@playwright/test').FullConfig} config
 */
async function globalSetup(config) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL: config.projects[0].use.baseURL });
  const authPage = new AuthPage(page);
  const username = generateUsername();
  const password = generatePassword();

  await authPage.fillRegisterForm(username, password);
  await authPage.clickRegisterButton();
  await expect(page).toHaveURL('/login');

  await authPage.loginUser(username, password);
  await expect(page).toHaveURL('/books');

  await page.context().storageState({ path: './e2e/storageState.json' });
  await browser.close();
}

export default globalSetup;
