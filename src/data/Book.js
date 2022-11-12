import axios from './axios';
import { formatItemDates } from '../utils/itemDateUtil';

const getBooks = async (status) => {
  const res = await axios({
    method: 'get',
    url: `/list/books/${status}`,
  });
  return res.data.results;
};

const getBookDetails = async (bookId) => {
  const res = await axios({
    method: 'get',
    url: `/list/books/book/${bookId}`,
  });
  return formatItemDates(res.data.results[0]);
};

const addBook = async (book) => {
  const res = await axios({
    method: 'post',
    url: '/list/books/add',
    data: book,
  });
  return res.data;
};

const updateBook = async (bookId, book) => {
  const res = await axios({
    method: 'put',
    url: `/list/books/update/${bookId}`,
    data: formatItemDates(book),
  });
  return res.data.results[0];
};

const deleteBook = async (bookId) => {
  const res = await axios({
    method: 'delete',
    url: `/list/books/delete/${bookId}`,
  });
  return res.data;
};

const searchBooks = async (query) => {
  const res = await axios({
    method: 'get',
    url: `/list/books/search?query=${query}`,
  });
  return res.data.results;
};

export { getBooks, getBookDetails, addBook, updateBook, deleteBook, searchBooks };
