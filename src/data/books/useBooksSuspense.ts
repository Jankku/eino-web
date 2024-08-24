import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { BookWithId } from '../../models/book';
import { ApiResponse } from '../types';

type Props = {
  status: string;
  sort?: string | null;
  order?: string | null;
  filter?: string | null;
};

export const getBooksQuery = async ({ status, sort, order, filter }: Props) => {
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

export const useBooksSuspense = ({ status, sort, order, filter }: Props) => {
  const queryClient = useQueryClient();
  return useSuspenseQuery({
    queryKey: ['books', status, sort, order, filter],
    queryFn: () => getBooksQuery({ status, sort, order, filter }),
    initialData: () =>
      queryClient
        .getQueryData<BookWithId[]>(['books', 'all'])
        ?.filter((book) => book.status === status),
  });
};
