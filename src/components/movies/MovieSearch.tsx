import { Autocomplete, createFilterOptions } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import SearchTextField from '../common/SearchTextField';
import { useMovieSearch } from '../../data/movies/useMovieSearch';
import SearchResult from '../common/SearchResult';
import { useSearch } from '../../hooks/useSearch';
import { MovieWithId } from '../../models/movie';

function MovieSearch() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isPending, mutate } = useMovieSearch();

  const onSelect = (item: MovieWithId) => {
    navigate(`./movies/${item.movie_id}`);
  };

  const { searchTerm, setSearchTerm, searchResults, selectedItem, setSelecteditem } =
    useSearch<MovieWithId>(mutate, onSelect);

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
      isOptionEqualToValue={(option, value) => option.movie_id === value.movie_id}
      value={selectedItem as MovieWithId}
      onChange={(_event, newValue) => setSelecteditem(newValue as MovieWithId)}
      filterOptions={filterOptions}
      getOptionLabel={(option) => (option as MovieWithId).title}
      inputValue={String(searchTerm)}
      onInputChange={(_e, value, reason) => {
        if (reason === 'input') setSearchTerm(value ?? '');
        if (['clear', 'reset'].includes(reason)) setSearchTerm('');
      }}
      id="search-input"
      renderInput={(params) => (
        <SearchTextField showShortcut params={{ ...params }} label="Search movies" />
      )}
      renderOption={(props, option: MovieWithId) => (
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

const filterOptions = createFilterOptions<MovieWithId>({
  ignoreCase: true,
  ignoreAccents: true,
  stringify: (option) => `${option.title} ${option.studio} ${option.director} ${option.writer}`,
  trim: true,
});

export default MovieSearch;
