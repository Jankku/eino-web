import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse } from '../types';
import { BookFormSchema } from '../../models/book';

export const searchBooksByIsbnQuery = async (isbn: string): Promise<BookFormSchema | null> => {
  const res = await api
    .get(`api/v1/list/books/search/isbn/${isbn}`)
    .json<ApiResponse<BookFormSchema[]>>();
  return res.results[0] ?? null;
};

export const useBookIsbnSearch = () => {
  return useMutation({
    mutationFn: searchBooksByIsbnQuery,
  });
};
