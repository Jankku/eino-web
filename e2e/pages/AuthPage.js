export default class AuthPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async registerUser(username, password) {
    await this.page.goto('/register');
    await this.page.getByRole('textbox', { name: 'username' }).fill(username);
    await this.page.getByLabel('Password', { exact: true }).fill(password);
    await this.page.getByLabel('Confirm password').fill(password);
    await this.page.locator('button[type=submit]').click();
  }

  async loginUser(username, password) {
    await this.page.goto('/login');
    await this.page.getByRole('textbox', { name: 'username' }).fill(username);
    await this.page.getByLabel('Password', { exact: true }).fill(password);
    await this.page.locator('button[type=submit]').click();
  }
}
