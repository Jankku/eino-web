import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { formatItemDates } from '../../utils/itemDateUtil';
import { api } from '../api';

export const getMovieDetailQuery = async (movieId) => {
  const res = await api.get(`api/v1/list/movies/movie/${movieId}`).json();
  return formatItemDates(res.results[0]);
};

export const useMovieDetail = (movieId) => {
  const queryClient = useQueryClient();
  return useSuspenseQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieDetailQuery(movieId),
    initialData: () =>
      queryClient
        .getQueryData({ queryKey: ['movies', 'all'], exact: true })
        ?.find((m) => m.movie_id === movieId),
  });
};
