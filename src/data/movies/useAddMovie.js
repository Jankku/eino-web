import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axios';

const addMovieQuery = async (movie) => {
  const res = await axios({
    method: 'post',
    url: '/v1/list/movies/add',
    data: movie,
  });
  return res.data;
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
