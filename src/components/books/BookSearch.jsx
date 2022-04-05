import { Autocomplete, createFilterOptions, ListItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookController from '../../data/BookController';
import useDebounce from '../../utils/useDebounce';
import SearchTextField from '../common/SearchTextField';

function BookSearch() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => `${option.title} ${option.author} ${option.publisher}`,
    trim: true,
  });

  const search = async (searchTerm) => {
    const res = await BookController.searchBooks(searchTerm);
    setSearchResults(res.data.results);
  };

  useEffect(() => {
    if (isOpen && debouncedSearchTerm.trim().length > 0) search(debouncedSearchTerm);
  }, [debouncedSearchTerm, isOpen]);

  useEffect(() => {
    if (selectedBook !== null) setShouldNavigate(true);

    if (selectedBook !== null && shouldNavigate) {
      navigate(`./books/${selectedBook.book_id}`);
      setSelectedBook(null);
      setSearchResults([]);
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
      onChange={(_event, newValue) => {
        setSelectedBook(newValue);
      }}
      filterOptions={filterOptions}
      getOptionLabel={(option) => option.title}
      inputValue={String(searchTerm)}
      onInputChange={(e) => {
        const value = e?.target?.value ?? '';
        setSearchTerm(value);
      }}
      renderInput={(params) => <SearchTextField params={{ ...params }} label="Search books" />}
      renderOption={(props, option) => (
        <ListItem {...props} key={option.book_id}>
          {option.title}
        </ListItem>
      )}
    />
  );
}

export default BookSearch;
