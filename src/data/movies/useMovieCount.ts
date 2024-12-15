import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '../api';

type MovieCountResponse = {
  all: number;
  watching: number;
  completed: number;
  'on-hold': number;
  dropped: number;
  planned: number;
};

export const movieCountQuery = async () => {
  return await api.get('api/v1/list/movies/count').json<MovieCountResponse>();
};

export const useMovieCount = () => {
  const result = useSuspenseQuery({
    queryKey: ['movies', 'count'],
    queryFn: movieCountQuery,
  });
  return result.data;
};
