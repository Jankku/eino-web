import { expect } from '@playwright/test';

export default class AuthPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async #isPasswordStrong() {
    const passwordStrength = await this.page
      .locator('#password-strength')
      .getAttribute('aria-label');
    const score = parseInt(passwordStrength.split('/')[0]);
    return score >= 3;
  }

  async expectPasswordIsWeak() {
    const isStrong = await this.#isPasswordStrong();
    expect(isStrong).toBe(false);
  }

  async fillRegisterForm(username, password) {
    await this.page.goto('/register');
    await this.page.getByRole('textbox', { name: 'username' }).fill(username);
    await this.page.getByLabel('Password', { exact: true }).fill(password);
    await this.page.getByLabel('Confirm password').fill(password);
  }

  async clickRegisterButton() {
    await this.page.locator('button[type=submit]').click();
  }

  async loginUser(username, password) {
    await this.page.goto('/login');
    await this.page.getByRole('textbox', { name: 'username' }).fill(username);
    await this.page.getByLabel('Password', { exact: true }).fill(password);
    await this.page.locator('button[type=submit]').click();
  }
}
