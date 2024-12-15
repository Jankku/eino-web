import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '../api';

type BookCountResponse = {
  all: number;
  reading: number;
  completed: number;
  'on-hold': number;
  dropped: number;
  planned: number;
};

export const bookCountQuery = async () => {
  return await api.get('api/v1/list/books/count').json<BookCountResponse>();
};

export const useBookCount = () => {
  const result = useSuspenseQuery({
    queryKey: ['books', 'count'],
    queryFn: bookCountQuery,
  });
  return result.data;
};
