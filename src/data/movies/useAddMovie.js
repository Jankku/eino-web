import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

const addMovieQuery = async (movie) => {
  return await api.post('api/v1/list/movies/add', { json: movie }).json();
};

export const useAddMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newMovie) => addMovieQuery(newMovie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });
};
