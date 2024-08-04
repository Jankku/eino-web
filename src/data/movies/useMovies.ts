import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { MovieWithId } from '../../models/movie';
import { ApiResponse } from '../types';

type Props = {
  status: string;
  sort?: string | null;
  order?: string | null;
};

export const getMoviesQuery = async ({ status, sort, order }: Props) => {
  const res = await api
    .get(`api/v1/list/movies/${status}`, {
      searchParams: {
        sort: sort || 'title',
        order: order || 'ascending',
      },
    })
    .json<ApiResponse<MovieWithId[]>>();
  return res.results;
};

export const useMovies = ({ status, sort, order }: Props) => {
  const queryClient = useQueryClient();
  return useSuspenseQuery({
    queryKey: ['movies', status, sort, order],
    queryFn: () => getMoviesQuery({ status, sort, order }),
    initialData: () =>
      queryClient
        .getQueryData<MovieWithId[]>(['movies', 'all'])
        ?.filter((movie) => movie.status === status),
  });
};
