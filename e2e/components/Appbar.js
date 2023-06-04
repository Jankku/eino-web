export default class Appbar {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async openDrawer() {
    await this.page.locator('button[name="drawer"]').click();
  }
}
