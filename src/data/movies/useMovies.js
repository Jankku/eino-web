import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export const getMoviesQuery = async (status) => {
  const res = await api.get(`api/v1/list/movies/${status}`).json();
  return res.results;
};

export const useMovies = (sortStatus) => {
  const queryClient = useQueryClient();
  return useSuspenseQuery({
    queryKey: ['movies', sortStatus],
    queryFn: () => getMoviesQuery(sortStatus),
    initialData: () =>
      queryClient
        .getQueryData({ queryKey: ['movies', 'all'] })
        ?.filter(({ status }) => status === sortStatus),
  });
};
