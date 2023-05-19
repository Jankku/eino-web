import { useMovies } from '../../data/movies/useMovies';
import movieSortOptions from '../../models/movieSortOptions';

export default function useMovieCount() {
  const { data } = useMovies('all');

  const counts = movieSortOptions.map((option) => {
    if (option.value === 'all') return [option.value, data?.length ?? 0];

    return [option.value, data?.filter((movie) => movie.status === option.value).length ?? 0];
  });

  return Object.fromEntries(counts);
}
