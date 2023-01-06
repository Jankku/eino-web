import { test, expect } from '@playwright/test';
import { capitalize, generateBook } from './util';

test.describe('Books', () => {
  test.describe.configure({ mode: 'serial' });
  const book = generateBook();

  test('Should create book and have correct info on list item', async ({ page }) => {
    await page.goto('/books');
    await page.getByRole('button', { name: 'Create book' }).click();

    await page.getByLabel('Title').fill(book.title);
    await page.getByLabel('Author').fill(book.author);
    await page.getByLabel('Publisher').fill(book.publisher);
    await page.getByLabel('ISBN').fill(book.isbn);
    await page.getByLabel('Pages').fill(book.pages);
    await page.getByLabel('Year').fill(book.year);
    await page.getByRole('combobox', { name: 'Score' }).selectOption(book.score);
    await page.getByRole('combobox', { name: 'Status' }).selectOption(book.status);

    await page.getByRole('button', { name: 'Create' }).click();

    const listItem = page.getByRole('listitem').filter({ hasText: book.title });
    await expect(listItem).toContainText(book.title);
    await expect(listItem).toContainText(book.author);
    await expect(listItem).toContainText(capitalize(book.status));
    await expect(listItem).toContainText(book.score);
  });

  test('Should navigate to book details', async ({ page }) => {
    await page.goto('/books');
    const listItem = page.getByRole('listitem').filter({ hasText: book.title });

    await listItem.getByRole('button', { name: 'Details' }).click();
    await expect(page).toHaveURL(/\/books\/[a-z0-9-]+/);
  });

  // TODO: Should edit book title

  test('Should delete book', async ({ page }) => {
    await page.goto('/books');
    const listItem = page.getByRole('listitem').filter({ hasText: book.title });

    await listItem.getByRole('button', { name: 'Details' }).click();
    await expect(page).toHaveURL(/\/books\/[a-z0-9-]+/);

    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page).toHaveURL('/books');
    await expect(listItem).toHaveCount(0);
  });
});
