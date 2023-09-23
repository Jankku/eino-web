import { useMutation } from '@tanstack/react-query';
import axios from '../axios';

const searchBooksQuery = async (query) => {
  const res = await axios({
    method: 'get',
    url: `/v1/list/books/search?query=${query}`,
  });
  return res.data.results;
};

export const useBookSearch = (isOpen) => {
  return useMutation({
    mutationFn: (term) => searchBooksQuery(term),
    staleTime: Infinity,
    enabled: isOpen,
  });
};
