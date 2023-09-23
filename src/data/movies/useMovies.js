import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../axios';

export const getMoviesQuery = async (status) => {
  const res = await axios({
    method: 'get',
    url: `/v1/list/movies/${status}`,
  });
  return res.data.results;
};

export const useMovies = (sortStatus) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['movies', sortStatus],
    queryFn: () => getMoviesQuery(sortStatus),
    initialData: () =>
      queryClient
        .getQueryData({ queryKey: ['movies', 'all'] })
        ?.filter(({ status }) => status === sortStatus),
    useErrorBoundary: (_, query) => {
      return query.state.data !== undefined ? false : true;
    },
  });
};
