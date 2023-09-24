import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatItemDates } from '../../utils/itemDateUtil';
import { api } from '../api';

export const getBookDetailQuery = async (bookId) => {
  const res = await api.get(`api/v1/list/books/book/${bookId}`).json();
  return formatItemDates(res.results[0]);
};

export const useBookDetail = (bookId) => {
  const queryClient = useQueryClient();
  return useQuery({
    enabled: !!bookId,
    queryKey: ['book', bookId],
    queryFn: () => getBookDetailQuery(bookId),
    initialData: () =>
      queryClient
        .getQueryData({ queryKey: ['books', 'all'], exact: true })
        ?.find((b) => b.book_id === bookId),
  });
};
