import { Page } from '@playwright/test';

export default class Appbar {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openDrawer() {
    await this.page.locator('button[name="drawer"]').click();
  }
}
