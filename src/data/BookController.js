import axios from './axios';

const BookController = {
  async getBooksByStatus(bookSortStatus) {
    return await axios({
      method: 'get',
      url: `/api/list/books/${bookSortStatus}`,
    });
  },

  async getBookDetails(bookId) {
    return await axios({
      method: 'get',
      url: `/api/list/books/book/${bookId}`,
    });
  },

  async addBook(formData) {
    await axios({
      method: 'post',
      url: '/api/list/books/add',
      data: formData,
    });
  },

  async updateBook(bookId, book) {
    await axios({
      method: 'put',
      url: `/api/list/books/update/${bookId}`,
      data: book,
    });
  },

  async deleteBook(bookId) {
    await axios({
      method: 'delete',
      url: `/api/list/books/delete/${bookId}`,
    });
  },
};

export default BookController;
