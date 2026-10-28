import { useSuspenseQueries, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { BookWithId } from '../../models/book';
import { ApiResponse } from '../types';

type UseBooksProps = {
  status: string;
  sort?: string | null;
  order?: string | null;
  filter?: string | null;
};

type BookCountResponse = {
  all: number;
  reading: number;
  completed: number;
  'on-hold': number;
  dropped: number;
  planned: number;
};

const bookCountQuery = () => api.get('api/v1/list/books/count').json<BookCountResponse>();

export const getBooksQuery = async ({ status, sort, order, filter }: UseBooksProps) => {
  const res = await api
    .get(`api/v1/list/books/${status}`, {
      searchParams: {
        sort: sort || 'title',
        order: order || 'ascending',
        filter: filter || '',
      },
    })
    .json<ApiResponse<BookWithId[]>>();
  return res.results;
};

export const useBooksSuspense = ({ status, sort, order, filter }: UseBooksProps) => {
  const queryClient = useQueryClient();
  const [books, counts] = useSuspenseQueries({
    queries: [
      {
        queryKey: ['books', status, sort || 'title', order || 'ascending', filter || ''],
        queryFn: () => getBooksQuery({ status, sort, order, filter }),
        initialData: () =>
          queryClient
            .getQueryData<BookWithId[]>(['books', 'all'])
            ?.filter((book) => book.status === status),
      },
      {
        queryKey: ['books', 'count'],
        queryFn: bookCountQuery,
      },
    ],
  });

  return { data: books.data, countByStatus: counts.data };
};
