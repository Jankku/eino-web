import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export const getBooksQuery = async (status) => {
  const res = await api.get(`api/v1/list/books/${status}`).json();
  return res.results;
};

export const useBooks = (sortStatus) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['books', sortStatus],
    queryFn: () => getBooksQuery(sortStatus),
    initialData: () =>
      queryClient
        .getQueryData({ queryKey: ['books', 'all'] })
        ?.filter(({ status }) => status === sortStatus),
    useErrorBoundary: (_, query) => {
      return query.state.data !== undefined ? false : true;
    },
  });
};
