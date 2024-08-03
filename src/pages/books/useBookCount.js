import { useBooks } from '../../data/books/useBooks';
import { bookSortStatuses } from '../../models/bookSortOptions';

export default function useBookCount() {
  const { data } = useBooks({ status: 'all' });

  const counts = bookSortStatuses.map((option) => {
    if (option.value === 'all') return [option.value, data?.length ?? 0];

    return [option.value, data?.filter((book) => book.status === option.value).length ?? 0];
  });

  return Object.fromEntries(counts);
}
