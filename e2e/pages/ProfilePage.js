import { generateBook, generateMovie } from '../util';

import 'dotenv/config';

export default class ProfilePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.baseURL = process.env.VITE_BASE_URL;
  }

  async #getAccessToken() {
    const token = (await this.page.context().storageState()).origins[0].localStorage.find(
      (item) => item.name === 'accessToken',
    );
    return token.value;
  }

  async createRandomBook() {
    const book = generateBook('completed');
    const token = await this.#getAccessToken();
    const url = new URL('api/v1/list/books/add', this.baseURL).toString();
    await this.page.request.post(url, {
      data: book,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async createRandomMovie() {
    const movie = generateMovie('completed');
    const token = await this.#getAccessToken();
    const url = new URL('api/v1/list/movies/add', this.baseURL).toString();
    await this.page.request.post(url, {
      data: movie,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }
}
