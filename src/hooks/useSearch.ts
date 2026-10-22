import { useState, useEffect } from 'react';
import { UseMutateFunction } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';

export function useSearch<T>(
  mutate: UseMutateFunction<T[], Error, string>,
  onSelect: (item: T) => void,
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<T[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  useEffect(() => {
    const handleSearch = (query: string) => {
      if (query) {
        mutate(query, {
          onSuccess: (results) => setSearchResults(results as T[]),
        });
      }
    };

    handleSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, mutate]);

  const setSelectedItem = (item: T | null) => {
    if (item) onSelect(item);
  };

  return { searchTerm, setSearchTerm, searchResults, selectedItem: null, setSelectedItem };
}
