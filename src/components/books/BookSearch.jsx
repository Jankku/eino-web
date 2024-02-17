import { Autocomplete, createFilterOptions } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchTextField from '../common/SearchTextField';
import { useBookSearch } from '../../data/books/useBookSearch';
import SearchResult from '../common/SearchResult';
import { useSearch } from '../../hooks/useSearch';

function BookSearch() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, mutate } = useBookSearch(isOpen);

  const onSelect = (item) => {
    navigate(`./books/${item.book_id}`);
  };

  const { searchTerm, setSearchTerm, searchResults, selectedItem, setSelecteditem } = useSearch(
    mutate,
    onSelect,
  );

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
      loading={isLoading}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      options={searchResults}
      isOptionEqualToValue={(option, value) => option.book_id === value.book_id}
      value={selectedItem}
      onChange={(_event, newValue) => setSelecteditem(newValue)}
      filterOptions={filterOptions}
      getOptionLabel={(option) => option.title}
      inputValue={String(searchTerm)}
      onInputChange={(e, value) => setSearchTerm(value ?? '')}
      renderInput={(params) => <SearchTextField params={{ ...params }} label="Search books" />}
      renderOption={(props, option) => (
        <SearchResult
          {...props}
          key={option.book_id}
          title={option?.title}
          subtitle={option?.author}
          imageUrl={option?.image_url}
        />
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
