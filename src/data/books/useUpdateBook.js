import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatItemDates } from '../../utils/itemDateUtil';
import { api } from '../api';
import { getBookDetailQuery } from './useBookDetail';

const updateBookQuery = async (bookId, book) => {
  const res = await api
    .put(`api/v1/list/books/update/${bookId}`, { json: formatItemDates(book) })
    .json();
  return res.results[0];
};

export const useUpdateBook = (bookId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (editedBook) => updateBookQuery(bookId, editedBook),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
    },
  });
};

export const useUpdateBookFormData = (visible, bookId) => {
  const queryClient = useQueryClient();
  return useQuery({
    suspense: false,
    enabled: visible,
    staleTime: Infinity,
    queryKey: ['book', bookId],
    initialData: () => queryClient.getQueryData({ queryKey: ['book', bookId] }),
    queryFn: () => getBookDetailQuery(bookId),
  });
};
