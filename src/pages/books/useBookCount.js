import { useBooks } from '../../data/books/useBooks';
import bookSortOptions from '../../models/bookSortOptions';

export default function useBookCount() {
  const { data } = useBooks('all');

  const counts = bookSortOptions.map((option) => {
    if (option.value === 'all') return [option.value, data?.length ?? 0];

    return [option.value, data?.filter((book) => book.status === option.value).length ?? 0];
  });

  return Object.fromEntries(counts);
}
