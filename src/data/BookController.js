import axios from './axios';

const BookController = {
  async getBooksByStatus(bookSortStatus, token) {
    return await axios({
      method: 'get',
      url: `/api/list/books/${bookSortStatus}`,
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
  },

  async getBookDetails(bookId, token) {
    return await axios({
      method: 'get',
      url: `/api/list/books/book/${bookId}`,
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
  },

  async addBook(token, formData) {
    await axios({
      method: 'post',
      url: '/api/list/books/add',
      headers: {
        Authorization: `bearer ${token}`,
      },
      data: formData,
    });
  },

  async updateBook(bookId, token, book) {
    await axios({
      method: 'put',
      url: `/api/list/books/update/${bookId}`,
      headers: {
        Authorization: `bearer ${token}`,
      },
      data: book,
    });
  },

  async deleteBook(bookId, token) {
    await axios({
      method: 'delete',
      url: `/api/list/books/delete/${bookId}`,
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
  },
};

export default BookController;
