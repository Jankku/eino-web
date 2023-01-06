import { expect } from '@playwright/test';
import { capitalize } from '../util';

export default class BookPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async navigateToDetail(listItem) {
    await listItem.getByRole('button', { name: 'Details' }).click();
    await expect(this.page).toHaveURL(/\/books\/[a-z0-9-]+/);
  }

  async createBook(book) {
    await this.page.getByLabel('Title').fill(book.title);
    await this.page.getByLabel('Author').fill(book.author);
    await this.page.getByLabel('Publisher').fill(book.publisher);
    await this.page.getByLabel('ISBN').fill(book.isbn);
    await this.page.getByLabel('Pages').fill(book.pages);
    await this.page.getByLabel('Year').fill(book.year);
    await this.page.getByRole('combobox', { name: 'Score' }).selectOption(book.score);
    await this.page.getByRole('combobox', { name: 'Status' }).selectOption(book.status);
    await this.page.locator('button[type=submit]').click();
  }

  async editBook(dialog, newBook) {
    await expect(this.page).toHaveURL(/\/books\/[a-z0-9-]+/);
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Title').fill(newBook.title);
    await dialog.getByLabel('Author').fill(newBook.author);
    await dialog.getByLabel('Publisher').fill(newBook.publisher);
    await dialog.getByLabel('ISBN').fill(newBook.isbn);
    await dialog.getByLabel('Pages').fill(newBook.pages);
    await dialog.getByLabel('Year').fill(newBook.year);
    await dialog.getByRole('combobox', { name: 'Score' }).selectOption(newBook.score);
    await dialog.getByRole('combobox', { name: 'Status' }).selectOption(newBook.status);
    await dialog.locator('button[type=submit]').click();
    await expect(dialog).not.toBeVisible();
  }

  async verifyListItem(listItem, book) {
    await expect(listItem).toContainText(book.title);
    await expect(listItem).toContainText(book.author);
    await expect(listItem).toContainText(capitalize(book.status));
    await expect(listItem).toContainText(book.score);
  }

  async verifyDetailContent(book) {
    await expect(this.page.getByRole('main')).toContainText(book.title);
    await expect(this.page.getByRole('main')).toContainText(book.author);
    await expect(this.page.getByRole('main')).toContainText(capitalize(book.status));
    await expect(this.page.getByRole('main')).toContainText(book.score);
  }
}
