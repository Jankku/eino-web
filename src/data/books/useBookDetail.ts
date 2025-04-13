import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { BookWithId } from '../../models/book';
import { ApiResponse } from '../types';

export const getBookDetailQuery = async (bookId: string) => {
  const res = await api.get(`api/v1/list/books/book/${bookId}`).json<ApiResponse<BookWithId[]>>();
  return res.results[0];
};

export const useBookDetail = (bookId: string) => {
  const queryClient = useQueryClient();
  return useSuspenseQuery({
    queryKey: ['book', bookId],
    queryFn: () => getBookDetailQuery(bookId),
    initialData: () =>
      queryClient.getQueryData<BookWithId[]>(['books', 'all'])?.find((b) => b.book_id === bookId),
  });
};
