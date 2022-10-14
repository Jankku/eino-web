import axios from './axios';

const getBooks = async (status) => {
  const res = await axios({
    method: 'get',
    url: `/api/list/books/${status}`,
  });
  return res.data.results;
};

const getBookDetails = async (bookId) => {
  const res = await axios({
    method: 'get',
    url: `/api/list/books/book/${bookId}`,
  });
  return res.data.results[0];
};

const addBook = async (book) => {
  const res = await axios({
    method: 'post',
    url: '/api/list/books/add',
    data: book,
  });
  return res.data;
};

const updateBook = async (bookId, book) => {
  const res = await axios({
    method: 'put',
    url: `/api/list/books/update/${bookId}`,
    data: book,
  });
  return res.data;
};

const deleteBook = async (bookId) => {
  const res = await axios({
    method: 'delete',
    url: `/api/list/books/delete/${bookId}`,
  });
  return res.data;
};

const searchBooks = async (query) => {
  const res = await axios({
    method: 'get',
    url: `/api/list/books/search?query=${query}`,
  });
  return res.data.results;
};

export { getBooks, getBookDetails, addBook, updateBook, deleteBook, searchBooks };
