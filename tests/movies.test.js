import { test, expect } from '@playwright/test';
import { capitalize, generateMovie } from './util';

test.describe('Books', () => {
  test.describe.configure({ mode: 'serial' });
  const movie = generateMovie();

  test('Should create movie and have correct title and director on item', async ({ page }) => {
    await page.goto('/movies');
    await page.getByRole('button', { name: 'create' }).click();

    await page.getByLabel('Title').fill(movie.title);
    await page.getByLabel('Studio').fill(movie.studio);
    await page.getByLabel('Director').fill(movie.director);
    await page.getByLabel('Writer').fill(movie.writer);
    await page.getByLabel('Duration').fill(movie.duration);
    await page.getByLabel('Year').fill(movie.year);
    await page.getByRole('combobox', { name: 'Score' }).selectOption(movie.score);
    await page.getByRole('combobox', { name: 'Status' }).selectOption(movie.status);

    await page.getByRole('button', { name: 'Create' }).click();

    const listItem = page.getByRole('listitem').filter({ hasText: movie.title });
    await expect(listItem).toContainText(movie.title);
    await expect(listItem).toContainText(movie.director);
    await expect(listItem).toContainText(capitalize(movie.status));
    await expect(listItem).toContainText(movie.score);
  });

  test('Should navigate to movie details', async ({ page }) => {
    await page.goto('/movies');
    const listItem = page.getByRole('listitem').filter({ hasText: movie.title });

    await listItem.getByRole('button', { name: 'Details' }).click();
    await expect(page).toHaveURL(/\/movies\/[a-z0-9-]+/);
  });
});
