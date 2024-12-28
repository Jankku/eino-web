import { Autocomplete, createFilterOptions } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import SearchTextField from '../common/SearchTextField';
import { useBookSearch } from '../../data/books/useBookSearch';
import SearchResult from '../common/SearchResult';
import { useSearch } from '../../hooks/useSearch';
import { BookWithId } from '../../models/book';

function BookSearch() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isPending, mutate } = useBookSearch();

  const onSelect = (item: BookWithId) => {
    navigate(`./books/${item.book_id}`);
  };

  const { searchTerm, setSearchTerm, searchResults, selectedItem, setSelecteditem } =
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
      isOptionEqualToValue={(option, value) => option.book_id === value.book_id}
      value={selectedItem as BookWithId}
      onChange={(_event, newValue) => setSelecteditem(newValue as BookWithId)}
      filterOptions={filterOptions}
      getOptionLabel={(option) => (option as BookWithId).title}
      inputValue={String(searchTerm)}
      onInputChange={(_e, value, reason) => {
        if (reason === 'input') setSearchTerm(value ?? '');
        if (['clear', 'reset'].includes(reason)) setSearchTerm('');
      }}
      id="search-input"
      renderInput={(params) => <SearchTextField showShortcut params={{ ...params }} label="Search books" />}
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
