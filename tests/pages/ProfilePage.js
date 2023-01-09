import { generateBook, generateMovie } from '../util';

require('dotenv').config();

export default class ProfilePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.baseURL = process.env.REACT_APP_BASE_URL;
  }

  async #getAccessToken() {
    const token = (await this.page.context().storageState()).origins[0].localStorage.find(
      (item) => item.name === 'accessToken'
    );
    return token.value;
  }

  async createRandomBook() {
    const book = generateBook();
    const token = await this.#getAccessToken();
    const url = new URL('list/books/add', this.baseURL).toString();
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
    const movie = generateMovie();
    const token = await this.#getAccessToken();
    const url = new URL('list/movies/add', this.baseURL).toString();
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
