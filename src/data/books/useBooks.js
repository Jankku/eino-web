import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../axios';

export const getBooksQuery = async (status) => {
  const res = await axios({
    method: 'get',
    url: `/list/books/${status}`,
  });
  return res.data.results;
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
