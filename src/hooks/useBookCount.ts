import { useBooksSuspense } from '../data/books/useBooksSuspense';
import { bookSortStatuses } from '../models/bookSortOptions';

export default function useBookCount() {
  const { data } = useBooksSuspense({ status: 'all' });

  const counts = bookSortStatuses.map((option) => {
    if (option.value === 'all') return [option.value, data?.length ?? 0];

    return [option.value, data?.filter((book) => book.status === option.value).length ?? 0];
  });

  return Object.fromEntries(counts);
}
