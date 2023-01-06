import { test, expect } from '@playwright/test';
import BookPage from './pages/BookPage';
import { generateBook } from './util';

test.describe('Books', () => {
  test.describe.configure({ mode: 'serial' });

  let book = generateBook();

  test('Should create book and have correct info on list item', async ({ page }) => {
    await page.goto('/books');
    const bookPage = new BookPage(page);
    await page.getByRole('button', { name: 'Create book' }).click();
    await bookPage.createBook(book);
    const listItem = page.getByRole('listitem').filter({ hasText: book.title });
    await bookPage.verifyListItem(listItem, book);
  });

  test('Should navigate to book details', async ({ page }) => {
    await page.goto('/books');
    const bookPage = new BookPage(page);
    const listItem = page.getByRole('listitem').filter({ hasText: book.title });
    await bookPage.navigateToDetail(listItem);
  });

  test('Should edit book', async ({ page }) => {
    await page.goto('/books');
    const bookPage = new BookPage(page);

    const listItem = page.getByRole('listitem').filter({ hasText: book.title });
    await bookPage.navigateToDetail(listItem);
    await bookPage.verifyDetailContent(book);

    await page.getByRole('button', { name: 'Edit' }).click();

    const editDialog = page.getByRole('dialog');
    book = generateBook();
    await bookPage.editBook(editDialog, book);
    await bookPage.verifyDetailContent(book);
  });

  test('Should delete book', async ({ page }) => {
    await page.goto('/books');
    const bookPage = new BookPage(page);
    const listItem = page.getByRole('listitem').filter({ hasText: book.title });
    await bookPage.navigateToDetail(listItem);

    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page).toHaveURL('/books');
    await expect(listItem).toHaveCount(0);
  });
});
