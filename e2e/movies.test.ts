import { test, expect } from '@playwright/test';
import MoviePage from './pages/MoviePage';
import { generateFormMovie } from './util';

test.describe('Movies', () => {
  test.describe.configure({ mode: 'serial' });

  const movie = generateFormMovie();

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

  test('Should delete movie', async ({ page }) => {
    await page.goto('/movies');
    const moviePage = new MoviePage(page);
    const listItem = page.getByRole('listitem').filter({ hasText: movie.title });
    await moviePage.navigateToDetail(listItem);

    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'You sure?' }).click();
    await expect(page).toHaveURL(/\/movies/);
    await expect(listItem).toHaveCount(0);
  });
});

test.describe('Movies', () => {
  test('Should edit movie', async ({ page }) => {
    await page.goto('/movies');
    const moviePage = new MoviePage(page);
    const movie = generateFormMovie();

    await page.getByRole('button', { name: 'create' }).click();
    await moviePage.createMovie(movie);

    const listItem = page.getByRole('listitem').filter({ hasText: movie.title });
    await moviePage.navigateToDetail(listItem);
    await moviePage.verifyDetailContent(movie);

    await page.getByRole('button', { name: 'Edit', exact: true }).click();
    const editDialog = page.getByRole('dialog');
    const newMovie = generateFormMovie();
    await moviePage.editMovie(editDialog, newMovie);
    await moviePage.verifyDetailContent(newMovie);
  });
});
