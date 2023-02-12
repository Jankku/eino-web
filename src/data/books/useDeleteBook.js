import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axios';

const deleteBookQuery = async (bookId) => {
  const res = await axios({
    method: 'delete',
    url: `/list/books/delete/${bookId}`,
  });
  return res.data;
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId) => deleteBookQuery(bookId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books'] }),
  });
};
