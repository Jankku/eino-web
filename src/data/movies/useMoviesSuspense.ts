import { useSuspenseQueries, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { MovieWithId } from '../../models/movie';
import { ApiResponse } from '../types';

type UseMoviesProps = {
  status: string;
  sort?: string | null;
  order?: string | null;
  filter?: string | null;
};

type MovieCountResponse = {
  all: number;
  watching: number;
  completed: number;
  'on-hold': number;
  dropped: number;
  planned: number;
};

const movieCountQuery = () => api.get('api/v2/list/movies/count').json<MovieCountResponse>();

export const getMoviesQuery = async ({ status, sort, order, filter }: UseMoviesProps) => {
  const res = await api
    .get(`api/v2/list/movies/${status}`, {
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
  const [movies, counts] = useSuspenseQueries({
    queries: [
      {
        queryKey: ['movies', status, sort || 'title', order || 'ascending', filter || ''],
        queryFn: () => getMoviesQuery({ status, sort, order, filter }),
        initialData: () =>
          queryClient
            .getQueryData<MovieWithId[]>(['movies', 'all'])
            ?.filter((movie) => movie.status === status),
      },
      {
        queryKey: ['movies', 'count'],
        queryFn: movieCountQuery,
      },
    ],
  });

  return { data: movies.data, countByStatus: counts.data };
};
