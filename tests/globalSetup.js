import { chromium, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import EinoPage from './EinoPage';

/**
 * @param {import('@playwright/test').FullConfig} config
 */
async function globalSetup(config) {
  const baseUrl = config.projects[0].use.baseURL;
  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL: baseUrl });
  const einoPage = new EinoPage(page);

  const username = faker.internet.userName();
  const password = faker.internet.password();

  await einoPage.registerUser(username, password);
  await expect(page).toHaveURL('/login');
  await einoPage.loginUser(username, password);
  await expect(page).toHaveURL('/books');

  await page.context().storageState({ path: './tests/storageState.json' });
  await browser.close();
}

export default globalSetup;
