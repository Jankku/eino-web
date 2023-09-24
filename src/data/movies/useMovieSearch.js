import { useMutation } from '@tanstack/react-query';
import { api } from '../api';

const searchMoviesQuery = async (query) => {
  const res = await api.get(`api/v1/list/movies/search`, { searchParams: { query } }).json();
  return res.results;
};

export const useMovieSearch = (isOpen) => {
  return useMutation({
    mutationFn: (term) => searchMoviesQuery(term),
    staleTime: Infinity,
    enabled: isOpen,
  });
};
