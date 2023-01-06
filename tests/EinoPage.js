export default class EinoPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async registerUser(username, password) {
    await this.page.goto('/register');
    await this.page.getByRole('textbox', { name: 'username' }).fill(username);
    await this.page.locator('#password').fill(password);
    await this.page.locator('#password2').fill(password);
    await this.page.getByRole('button', { name: 'Register' }).click();
  }

  async loginUser(username, password) {
    await this.page.goto('/login');
    await this.page.getByRole('textbox', { name: 'username' }).fill(username);
    await this.page.getByRole('textbox', { name: 'password' }).fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
