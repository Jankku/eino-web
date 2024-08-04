import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { BookWithId } from '../../models/book';
import { ApiResponse } from '../types';

type Props = {
  status: string;
  sort?: string | null;
  order?: string | null;
};

export const getBooksQuery = async ({ status, sort, order }: Props) => {
  const res = await api
    .get(`api/v1/list/books/${status}`, {
      searchParams: {
        sort: sort || 'title',
        order: order || 'ascending',
      },
    })
    .json<ApiResponse<BookWithId[]>>();
  return res.results;
};

export const useBooks = ({ status, sort, order }: Props) => {
  const queryClient = useQueryClient();
  return useSuspenseQuery({
    queryKey: ['books', status, sort, order],
    queryFn: () => getBooksQuery({ status, sort, order }),
    initialData: () =>
      queryClient
        .getQueryData<BookWithId[]>(['books', 'all'])
        ?.filter((book) => book.status === status),
  });
};
