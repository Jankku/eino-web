import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse } from '../types';
import { BookWithId } from '../../models/book';

const searchBooksQuery = async (query: string) => {
  const res = await api
    .get(`api/v1/list/books/search`, { searchParams: { query } })
    .json<ApiResponse<BookWithId[]>>();
  return res.results;
};

export const useBookSearch = () => {
  return useMutation({
    mutationFn: (query: string) => searchBooksQuery(query),
  });
};
