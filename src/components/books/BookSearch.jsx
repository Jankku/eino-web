import { Autocomplete, createFilterOptions, ListItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { searchBooks } from '../../data/Book';
import useDebounce from '../../hooks/useDebounce';
import SearchTextField from '../common/SearchTextField';

function BookSearch() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const { mutate } = useMutation((term) => searchBooks(term), {
    staleTime: Infinity,
    enabled: isOpen,
    onSuccess: (results) => setSearchResults(results),
  });

  useEffect(() => {
    if (debouncedSearchTerm) mutate(debouncedSearchTerm);
  }, [debouncedSearchTerm, mutate]);

  useEffect(() => {
    if (selectedBook !== null) setShouldNavigate(true);

    if (selectedBook !== null && shouldNavigate) {
      navigate(`./books/${selectedBook.book_id}`);
      setSelectedBook(null);
    }

    return () => setShouldNavigate(false);
  }, [selectedBook, navigate, shouldNavigate]);

  return (
    <Autocomplete
      freeSolo
      includeInputInList
      autoHighlight
      clearOnEscape
      blurOnSelect
      clearOnBlur
      size="small"
      sx={{ width: '100%' }}
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      options={searchResults}
      isOptionEqualToValue={(option, value) => option.book_id === value.book_id}
      value={selectedBook}
      onChange={(_event, newValue) => setSelectedBook(newValue)}
      filterOptions={filterOptions}
      getOptionLabel={(option) => option.title}
      inputValue={String(searchTerm)}
      onInputChange={(e, value) => setSearchTerm(value ?? '')}
      renderInput={(params) => <SearchTextField params={{ ...params }} label="Search books" />}
      renderOption={(props, option) => (
        <ListItem {...props} key={option.book_id}>
          {option.title}
        </ListItem>
      )}
    />
  );
}

const filterOptions = createFilterOptions({
  ignoreCase: true,
  ignoreAccents: true,
  stringify: (option) => `${option.title} ${option.author} ${option.publisher}`,
  trim: true,
});

export default BookSearch;
