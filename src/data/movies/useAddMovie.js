import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

const addMovieQuery = async (movie) => {
  const res = await api.post('api/v1/list/movies/add', { json: movie }).json();
  return res;
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
