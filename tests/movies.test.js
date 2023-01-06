import { test, expect } from '@playwright/test';
import MoviePage from './pages/MoviePage';
import { generateMovie } from './util';

test.describe('Movies', () => {
  test.describe.configure({ mode: 'serial' });

  let movie = generateMovie();

  test('Should create movie and have correct title and director on item', async ({ page }) => {
    await page.goto('/movies');
    const moviePage = new MoviePage(page);
    await page.getByRole('button', { name: 'create' }).click();
    await moviePage.createMovie(movie);
    const listItem = page.getByRole('listitem').filter({ hasText: movie.title });
    await moviePage.verifyListItem(listItem, movie);
  });

  test('Should navigate to movie details', async ({ page }) => {
    await page.goto('/movies');
    const moviePage = new MoviePage(page);
    const listItem = page.getByRole('listitem').filter({ hasText: movie.title });
    await moviePage.navigateToDetail(listItem);
  });

  test('Should edit movie', async ({ page }) => {
    await page.goto('/movies');
    const moviePage = new MoviePage(page);

    const listItem = page.getByRole('listitem').filter({ hasText: movie.title });
    await moviePage.navigateToDetail(listItem);
    await moviePage.verifyDetailContent(movie);

    await page.getByRole('button', { name: 'Edit' }).click();

    const editDialog = page.getByRole('dialog');
    movie = generateMovie();
    await moviePage.editMovie(editDialog, movie);
    await moviePage.verifyDetailContent(movie);
  });

  test('Should delete movie', async ({ page }) => {
    await page.goto('/movies');
    const moviePage = new MoviePage(page);
    const listItem = page.getByRole('listitem').filter({ hasText: movie.title });
    await moviePage.navigateToDetail(listItem);

    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page).toHaveURL('/movies');
    await expect(listItem).toHaveCount(0);
  });
});
