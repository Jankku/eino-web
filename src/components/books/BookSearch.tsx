import { requestNavigationFocus } from '../../hooks/useNavigationFocus';
import { Autocomplete, createFilterOptions } from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import SearchTextField from '../common/SearchTextField';
import { useBookSearch } from '../../data/books/useBookSearch';
import SearchResult from '../common/SearchResult';
import { useSearch } from '../../hooks/useSearch';
import { BookWithId } from '../../models/book';

function BookSearch() {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isPending, mutate } = useBookSearch();

  const onSelect = (item: BookWithId) => {
    const itemPath = `/books/${item.book_id}`;
    navigate({ pathname: itemPath, search: searchParams.toString() });
    if (pathname === itemPath) requestNavigationFocus(itemPath);
  };

  const { searchTerm, setSearchTerm, searchResults, selectedItem, setSelectedItem } =
    useSearch<BookWithId>(mutate, onSelect);

  return (
    <Autocomplete
      freeSolo
      includeInputInList
      autoHighlight
      clearOnEscape
      blurOnSelect
      clearOnBlur
      disableClearable
      size="small"
      sx={{ width: '100%' }}
      open={isOpen}
      loading={isPending}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      options={searchResults}
      isOptionEqualToValue={(option, value) =>
        typeof value !== 'string' && option.book_id === value.book_id
      }
      value={selectedItem ?? ''}
      onChange={(_event, newValue) => {
        if (typeof newValue !== 'string') setSelectedItem(newValue);
      }}
      filterOptions={filterOptions}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.title)}
      inputValue={String(searchTerm)}
      onInputChange={(_e, value, reason) => {
        if (reason === 'input') setSearchTerm(value ?? '');
        if (['clear', 'reset'].includes(reason)) setSearchTerm('');
      }}
      id="search-input"
      renderInput={(params) => (
        <SearchTextField showShortcut params={{ ...params }} label="Search books" />
      )}
      renderOption={(props, option: BookWithId) => (
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

const filterOptions = createFilterOptions<BookWithId>({
  ignoreCase: true,
  ignoreAccents: true,
  stringify: (option) => `${option.title} ${option.author} ${option.publisher}`,
  trim: true,
});

export default BookSearch;
