import { Autocomplete, createFilterOptions } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchTextField from '../common/SearchTextField';
import { useMovieSearch } from '../../data/movies/useMovieSearch';
import SearchResult from '../common/SearchResult';
import { useSearch } from '../../hooks/useSearch';

function MovieSearch() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, mutate } = useMovieSearch(isOpen);

  const onSelect = (item) => {
    navigate(`./movies/${item.movie_id}`);
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
      isOptionEqualToValue={(option, value) => option.movie_id === value.movie_id}
      value={selectedItem}
      onChange={(_event, newValue) => setSelecteditem(newValue)}
      filterOptions={filterOptions}
      getOptionLabel={(option) => option.title}
      inputValue={String(searchTerm)}
      onInputChange={(e, value) => setSearchTerm(value ?? '')}
      renderInput={(params) => <SearchTextField params={{ ...params }} label="Search movies" />}
      renderOption={(props, option) => (
        <SearchResult
          {...props}
          key={option.movie_id}
          title={option?.title}
          subtitle={option?.director}
          imageUrl={option?.image_url}
        />
      )}
    />
  );
}

const filterOptions = createFilterOptions({
  ignoreCase: true,
  ignoreAccents: true,
  stringify: (option) => `${option.title} ${option.studio} ${option.director} ${option.writer}`,
  trim: true,
});

export default MovieSearch;
