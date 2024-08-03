import { test, expect } from '@playwright/test';
import BookPage from './pages/BookPage';
import { generateFormBook } from './util';

test.describe('Books', () => {
  test.describe.configure({ mode: 'serial' });

  const book = generateFormBook();

  test('Should create book and have correct info on list item', async ({ page }) => {
    await page.goto('/books');
    const bookPage = new BookPage(page);
    await page.getByRole('button', { name: 'create' }).click();
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

  test('Should delete book', async ({ page }) => {
    await page.goto('/books');
    const bookPage = new BookPage(page);
    const listItem = page.getByRole('listitem').filter({ hasText: book.title });
    await bookPage.navigateToDetail(listItem);

    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'You sure?' }).click();
    await expect(page).toHaveURL(/\/books/);
    await expect(listItem).toHaveCount(0);
  });
});

test.describe('Books', () => {
  test('Should edit book', async ({ page }) => {
    await page.goto('/books');
    const bookPage = new BookPage(page);
    const book = generateFormBook();

    await page.getByRole('button', { name: 'create' }).click();
    await bookPage.createBook(book);

    const listItem = page.getByRole('listitem').filter({ hasText: book.title, exact: true });
    await bookPage.navigateToDetail(listItem);
    await bookPage.verifyDetailContent(book);

    await page.getByRole('button', { name: 'Edit', exact: true }).click();
    const editDialog = page.getByRole('dialog');
    const newBook = generateFormBook();
    await bookPage.editBook(editDialog, newBook);
    await bookPage.verifyDetailContent(newBook);
  });
});
