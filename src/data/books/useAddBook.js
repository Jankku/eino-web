import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axios';

const addBookQuery = async (book) => {
  const res = await axios({
    method: 'post',
    url: '/list/books/add',
    data: book,
  });
  return res.data;
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
