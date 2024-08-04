import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { Book } from '../../models/book';

const addBookQuery = async (book: Book) => {
  return await api.post('api/v1/list/books/add', { json: book }).json();
};

export const useAddBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newBook: Book) => addBookQuery(newBook),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};
