import { useSuspenseQueries } from '@tanstack/react-query';
import { api } from '../api';
import { MovieWithId } from '../../models/movie';
import { ApiResponse, PageParams } from '../types';
import { getPage } from '../pagination';

type UseMoviesProps = {
  status: string;
  sort?: string | null;
  order?: string | null;
  filter?: string | null;
};

type MovieCountResponse = {
  all: number;
  watching: number;
  completed: number;
  'on-hold': number;
  dropped: number;
  planned: number;
};

const movieCountQuery = () => api.get('api/v2/list/movies/count').json<MovieCountResponse>();

export const getMoviesQuery = async ({ status, sort, order, filter }: UseMoviesProps) => {
  const res = await api
    .get(`api/v2/list/movies/${status}`, {
      searchParams: {
        sort: sort || 'title',
        order: order || 'ascending',
        filter: filter || '',
      },
    })
    .json<ApiResponse<MovieWithId[]>>();
  return res.results;
};

export const useMoviesSuspense = ({
  status,
  sort,
  order,
  filter,
  page,
  pageSize,
}: UseMoviesProps & PageParams) => {
  const options = {
    status,
    sort: sort || 'title',
    order: order || 'ascending',
    filter: filter || '',
    page,
    pageSize,
  };
  const [movies, counts] = useSuspenseQueries({
    queries: [
      {
        queryKey: ['movies', 'page', options],
        queryFn: () =>
          getPage<MovieWithId>(
            `api/v2/list/movies/${options.status}`,
            { page: options.page, pageSize: options.pageSize },
            { sort: options.sort, order: options.order, filter: options.filter },
          ),
      },
      {
        queryKey: ['movies', 'count'],
        queryFn: movieCountQuery,
      },
    ],
  });

  return {
    data: movies.data.results,
    pagination: movies.data.pagination,
    isFetching: movies.isFetching,
    countByStatus: counts.data,
  };
};
