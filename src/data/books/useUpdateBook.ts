import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { getBookDetailQuery } from './useBookDetail';
import { Book, BookWithId } from '../../models/book';
import { ApiResponse } from '../types';

const updateBookQuery = async (bookId: string, book: Book) => {
  const res = await api
    .put(`api/v1/list/books/update/${bookId}`, { json: book })
    .json<ApiResponse<BookWithId[]>>();
  return res.results[0];
};

export const useUpdateBook = (bookId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (editedBook: Book) => updateBookQuery(bookId, editedBook),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
    },
  });
};

export const useUpdateBookFormData = (visible: boolean, bookId: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    enabled: visible,
    staleTime: Infinity,
    queryKey: ['book', bookId],
    initialData: () => queryClient.getQueryData(['book', bookId]),
    queryFn: () => getBookDetailQuery(bookId),
  });
};
