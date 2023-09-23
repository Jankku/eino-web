import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatItemDates } from '../../utils/itemDateUtil';
import axios from '../axios';

export const getMovieDetailQuery = async (movieId) => {
  const res = await axios({
    method: 'get',
    url: `/v1/list/movies/movie/${movieId}`,
  });
  return formatItemDates(res.data.results[0]);
};

export const useMovieDetail = (movieId) => {
  const queryClient = useQueryClient();
  return useQuery({
    enabled: !!movieId,
    queryKey: ['movie', movieId],
    queryFn: () => getMovieDetailQuery(movieId),
    initialData: () =>
      queryClient
        .getQueryData({ queryKey: ['movies', 'all'], exact: true })
        ?.find((m) => m.movie_id === movieId),
  });
};
