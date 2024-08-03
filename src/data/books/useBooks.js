import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export const getBooksQuery = async ({ status, sort, order }) => {
  const res = await api
    .get(`api/v1/list/books/${status}`, {
      searchParams: {
        sort: sort || 'title',
        order: order || 'ascending',
      },
    })
    .json();
  return res.results;
};

export const useBooks = ({ status, sort, order }) => {
  const queryClient = useQueryClient();
  return useSuspenseQuery({
    queryKey: ['books', status, sort, order],
    queryFn: () => getBooksQuery({ status, sort, order }),
    initialData: () =>
      queryClient
        .getQueryData({ queryKey: ['books', 'all'] })
        ?.filter((book) => book.status === status),
  });
};
