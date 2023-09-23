import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axios';

const deleteMovieQuery = async (movieId) => {
  const res = await axios({
    method: 'delete',
    url: `/v1/list/movies/delete/${movieId}`,
  });
  return res.data;
};

export const useDeleteMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (movieId) => deleteMovieQuery(movieId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['movies'] }),
  });
};
