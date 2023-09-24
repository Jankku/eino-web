import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatItemDates } from '../../utils/itemDateUtil';
import { api } from '../api';
import { getMovieDetailQuery } from './useMovieDetail';

const updateMovieQuery = async (movieId, movie) => {
  const res = await api
    .put(`api/v1/list/movies/update/${movieId}`, { json: formatItemDates(movie) })
    .json();
  return res.results[0];
};

export const useUpdateMovie = (movieId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (editedMovie) => updateMovieQuery(movieId, editedMovie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['movie', movieId] });
    },
  });
};

export const useUpdateMovieFormData = (visible, movieId) => {
  const queryClient = useQueryClient();
  return useQuery({
    suspense: false,
    enabled: visible,
    staleTime: Infinity,
    queryKey: ['movie', movieId],
    initialData: () => queryClient.getQueryData({ queryKey: ['movie', movieId] }),
    queryFn: () => getMovieDetailQuery(movieId),
  });
};
