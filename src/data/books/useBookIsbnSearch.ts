import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse } from '../types';
import { BookLookup } from '../../models/book';

export const searchBooksByIsbnQuery = async (isbn: string): Promise<BookLookup | null> => {
  const res = await api
    .get(`api/v2/list/books/search/isbn/${isbn}`)
    .json<ApiResponse<BookLookup[]>>();
  return res.results[0] ?? null;
};

export const useBookIsbnSearch = () => {
  return useMutation({
    mutationFn: searchBooksByIsbnQuery,
  });
};
