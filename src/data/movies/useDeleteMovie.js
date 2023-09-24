import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

const deleteMovieQuery = async (movieId) => {
  const res = await api.delete(`api/v1/list/movies/delete/${movieId}`).json();
  return res;
};

export const useDeleteMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (movieId) => deleteMovieQuery(movieId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['movies'] }),
  });
};
