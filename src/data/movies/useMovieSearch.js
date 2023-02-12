import { useMutation } from '@tanstack/react-query';
import axios from '../axios';

const searchMoviesQuery = async (query) => {
  const res = await axios({
    method: 'get',
    url: `/list/movies/search?query=${query}`,
  });
  return res.data.results;
};

export const useMovieSearch = (isOpen) => {
  return useMutation({
    mutationFn: (term) => searchMoviesQuery(term),
    staleTime: Infinity,
    enabled: isOpen,
  });
};
