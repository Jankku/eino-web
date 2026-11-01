import { useQuery } from '@tanstack/react-query';
import { getMoviesQuery } from './useMoviesSuspense';

type UseMoviesProps = {
  status: string;
  enabled: boolean;
  filter?: string | null;
};

export const useMovies = ({ enabled, status, filter }: UseMoviesProps) => {
  return useQuery({
    enabled,
    queryKey: ['movies', 'full', status, 'title', 'ascending', filter || ''],
    queryFn: () => getMoviesQuery({ status, filter }),
  });
};
