import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

const deleteBookQuery = async (bookId) => {
  return await api.delete(`api/v1/list/books/delete/${bookId}`).json();
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId) => deleteBookQuery(bookId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books'] }),
  });
};
