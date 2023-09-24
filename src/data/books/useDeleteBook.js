import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

const deleteBookQuery = async (bookId) => {
  const res = await api.delete(`api/v1/list/books/delete/${bookId}`).json();
  return res;
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId) => deleteBookQuery(bookId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books'] }),
  });
};
