import { useMutation } from '@tanstack/react-query';
import { api } from '../api';

const searchBooksQuery = async (query) => {
  const res = await api.get(`api/v1/list/books/search`, { searchParams: { query } }).json();
  return res.results;
};

export const useBookSearch = (isOpen) => {
  return useMutation({
    mutationFn: (term) => searchBooksQuery(term),
    staleTime: Infinity,
    enabled: isOpen,
  });
};
