import { useQuery } from '@tanstack/react-query';
import { getMoviesQuery } from './useMoviesSuspense';

type Props = {
  status: string;
  enabled: boolean;
  filter?: string | null;
};

export const useMovies = ({ enabled, status, filter }: Props) => {
  return useQuery({
    enabled,
    queryKey: ['movies', status, filter],
    queryFn: () => getMoviesQuery({ status, filter }),
  });
};
