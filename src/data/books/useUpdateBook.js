import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatItemDates } from '../../utils/itemDateUtil';
import axios from '../axios';
import { getBookDetailQuery } from './useBookDetail';

const updateBookQuery = async (bookId, book) => {
  const res = await axios({
    method: 'PUT',
    url: `/list/books/update/${bookId}`,
    data: formatItemDates(book),
  });
  return res.data.results[0];
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
