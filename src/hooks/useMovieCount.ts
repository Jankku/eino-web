import { useMoviesSuspense } from '../data/movies/useMoviesSuspense';
import { movieSortStatuses } from '../models/movieSortOptions';

export default function useMovieCount() {
  const { data } = useMoviesSuspense({ status: 'all' });

  const counts = movieSortStatuses.map((option) => {
    if (option.value === 'all') return [option.value, data?.length ?? 0];

    return [option.value, data?.filter((movie) => movie.status === option.value).length ?? 0];
  });

  return Object.fromEntries(counts);
}
