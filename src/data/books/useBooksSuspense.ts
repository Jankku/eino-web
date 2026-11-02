import { useSuspenseQueries } from '@tanstack/react-query';
import { api } from '../api';
import { BookWithId } from '../../models/book';
import { ApiResponse, PageParams } from '../types';
import { getPage } from '../pagination';

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

const bookCountQuery = () => api.get('api/v2/list/books/count').json<BookCountResponse>();

export const getBooksQuery = async ({ status, sort, order, filter }: UseBooksProps) => {
  const res = await api
    .get(`api/v2/list/books/${status}`, {
      searchParams: {
        sort: sort || 'title',
        order: order || 'ascending',
        filter: filter || '',
      },
    })
    .json<ApiResponse<BookWithId[]>>();
  return res.results;
};

export const useBooksSuspense = ({
  status,
  sort,
  order,
  filter,
  page,
  pageSize,
}: UseBooksProps & PageParams) => {
  const options = {
    status,
    sort: sort || 'title',
    order: order || 'ascending',
    filter: filter || '',
    page,
    pageSize,
  };
  const [books, counts] = useSuspenseQueries({
    queries: [
      {
        queryKey: ['books', 'page', options],
        queryFn: () =>
          getPage<BookWithId>(
            `api/v2/list/books/${options.status}`,
            { page: options.page, pageSize: options.pageSize },
            { sort: options.sort, order: options.order, filter: options.filter },
          ),
      },
      {
        queryKey: ['books', 'count'],
        queryFn: bookCountQuery,
      },
    ],
  });

  return {
    data: books.data.results,
    pagination: books.data.pagination,
    isFetching: books.isFetching,
    countByStatus: counts.data,
  };
};
