import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatItemDates } from '../../utils/itemDateUtil';
import axios from '../axios';

export const getBookDetailQuery = async (bookId) => {
  const res = await axios({
    method: 'get',
    url: `/list/books/book/${bookId}`,
  });
  return formatItemDates(res.data.results[0]);
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
