import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { UseMutateFunction } from '@tanstack/react-query';

export function useSearch<T>(
  mutate: UseMutateFunction<T[], Error, string>,
  onSelect: (item: T) => void,
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<T[]>([]);
  const [selectedItem, setSelecteditem] = useState<T | null>(null);
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

  useEffect(() => {
    if (selectedItem) onSelect(selectedItem);
    setSelecteditem(null);
  }, [onSelect, selectedItem]);

  return { searchTerm, setSearchTerm, searchResults, selectedItem, setSelecteditem };
}
