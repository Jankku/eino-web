import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export const getMoviesQuery = async (status) => {
  const res = await api.get(`api/v1/list/movies/${status}`).json();
  return res.results;
};

export const useMovies = (sortStatus) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['movies', sortStatus],
    queryFn: () => getMoviesQuery(sortStatus),
    initialData: () =>
      queryClient
        .getQueryData({ queryKey: ['movies', 'all'] })
        ?.filter(({ status }) => status === sortStatus),
    useErrorBoundary: (_, query) => {
      return query.state.data !== undefined ? false : true;
    },
  });
};
