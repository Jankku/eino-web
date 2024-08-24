import { expect, Locator, Page } from '@playwright/test';
import { capitalize } from '../util';

export default class MoviePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToDetail(listItem: Locator) {
    await listItem.click();
    await expect(this.page).toHaveURL(/\/movies\/[a-z0-9-]+/);
  }

  async createMovie(movie) {
    await this.page.getByLabel('Title').fill(movie.title);
    await this.page.getByLabel('Studio').fill(movie.studio);
    await this.page.getByLabel('Director').fill(movie.director);
    await this.page.getByLabel('Writer').fill(movie.writer);
    await this.page.getByLabel('Duration').fill(movie.duration);
    await this.page.getByLabel('Release year').fill(movie.year);
    await this.page.getByRole('combobox', { name: 'Score' }).selectOption(movie.score);
    await this.page.getByRole('combobox', { name: 'Status' }).selectOption(movie.status);
    await this.page.locator('button[type=submit]').click();
  }

  async editMovie(dialog: Locator, newMovie) {
    await expect(this.page).toHaveURL(/\/movies\/[a-z0-9-]+/);
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Title').fill(newMovie.title);
    await dialog.getByLabel('Studio').fill(newMovie.studio);
    await dialog.getByLabel('Director').fill(newMovie.director);
    await dialog.getByLabel('Writer').fill(newMovie.writer);
    await dialog.getByLabel('Duration').fill(newMovie.duration);
    await dialog.getByLabel('Release year').fill(newMovie.year);
    await dialog.getByRole('combobox', { name: 'Score' }).selectOption(newMovie.score);
    await dialog.getByRole('combobox', { name: 'Status' }).selectOption(newMovie.status);
    await dialog.locator('button[type=submit]').click();
    await expect(dialog).not.toBeVisible();
  }

  async verifyListItem(listItem: Locator, movie) {
    await expect(listItem).toContainText(movie.title);
    await expect(listItem).toContainText(movie.director);
    await expect(listItem).toContainText(capitalize(movie.status));
    await expect(listItem).toContainText(movie.score);
  }

  async verifyDetailContent(movie) {
    await expect(this.page.getByRole('main')).toContainText(movie.title);
    await expect(this.page.getByRole('main')).toContainText(movie.director);
    await expect(this.page.getByRole('main')).toContainText(capitalize(movie.status));
    await expect(this.page.getByRole('main')).toContainText(movie.score);
  }
}
