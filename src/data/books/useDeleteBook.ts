import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const deleteBookQuery = async (bookId: string) => {
  return await api.delete(`api/v1/list/books/delete/${bookId}`).json<ApiResponse<Result>>();
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: string) => deleteBookQuery(bookId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books'] }),
  });
};
