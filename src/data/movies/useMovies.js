import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export const getMoviesQuery = async ({ status, sort, order }) => {
  const res = await api
    .get(`api/v1/list/movies/${status}`, {
      searchParams: {
        sort: sort || 'title',
        order: order || 'ascending',
      },
    })
    .json();
  return res.results;
};

export const useMovies = ({ status, sort, order }) => {
  const queryClient = useQueryClient();
  return useSuspenseQuery({
    queryKey: ['movies', status, sort, order],
    queryFn: () => getMoviesQuery({ status, sort, order }),
    initialData: () =>
      queryClient
        .getQueryData({ queryKey: ['movies', 'all'] })
        ?.filter((movie) => movie.status === status),
  });
};
