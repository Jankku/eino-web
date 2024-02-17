import { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';

export function useSearch(mutate, onSelect) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelecteditem] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  const handleSearch = (term) => {
    if (term) {
      mutate(term, {
        onSuccess: (results) => setSearchResults(results),
      });
    }
  };

  useEffect(() => handleSearch(debouncedSearchTerm), [debouncedSearchTerm]);

  useEffect(() => {
    if (selectedItem) onSelect(selectedItem);
    setSelecteditem(null);
  }, [selectedItem]);

  return { searchTerm, setSearchTerm, searchResults, selectedItem, setSelecteditem };
}
