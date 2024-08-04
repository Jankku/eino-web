import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatItemDates } from '../../utils/itemDateUtil';
import { api } from '../api';
import { getMovieDetailQuery } from './useMovieDetail';
import { Movie, MovieWithId } from '../../models/movie';
import { ApiResponse } from '../types';

const updateMovieQuery = async (movieId: string, movie: Movie) => {
  const res = await api
    .put(`api/v1/list/movies/update/${movieId}`, { json: formatItemDates(movie) })
    .json<ApiResponse<MovieWithId[]>>();
  return res.results[0];
};

export const useUpdateMovie = (movieId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (editedMovie: Movie) => updateMovieQuery(movieId, editedMovie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['movie', movieId] });
    },
  });
};

export const useUpdateMovieFormData = (visible: boolean, movieId: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    enabled: visible,
    staleTime: Infinity,
    queryKey: ['movie', movieId],
    initialData: () => queryClient.getQueryData(['movie', movieId]),
    queryFn: () => getMovieDetailQuery(movieId),
  });
};
