import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

const addBookQuery = async (book) => {
  return await api.post('api/v1/list/books/add', { json: book }).json();
};

export const useAddBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newBook) => addBookQuery(newBook),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};
