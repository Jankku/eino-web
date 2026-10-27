import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { MovieWithId } from '../../models/movie';
import { ApiResponse } from '../types';

type UseMoviesProps = {
  status: string;
  sort?: string | null;
  order?: string | null;
  filter?: string | null;
};

export const getMoviesQuery = async ({ status, sort, order, filter }: UseMoviesProps) => {
  const res = await api
    .get(`api/v1/list/movies/${status}`, {
      searchParams: {
        sort: sort || 'title',
        order: order || 'ascending',
        filter: filter || '',
      },
    })
    .json<ApiResponse<MovieWithId[]>>();
  return res.results;
};

export const useMoviesSuspense = ({ status, sort, order, filter }: UseMoviesProps) => {
  const queryClient = useQueryClient();
  return useSuspenseQuery({
    queryKey: ['movies', status, sort, order, filter],
    queryFn: () => getMoviesQuery({ status, sort, order, filter }),
    initialData: () =>
      queryClient
        .getQueryData<MovieWithId[]>(['movies', 'all'])
        ?.filter((movie) => movie.status === status),
  });
};
