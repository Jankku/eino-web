import { Autocomplete, createFilterOptions } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import SearchTextField from '../common/SearchTextField';
import { useMovieSearch } from '../../data/movies/useMovieSearch';
import SearchResult from '../common/SearchResult';

function MovieSearch() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const { isLoading, mutate } = useMovieSearch(isOpen);

  useEffect(() => {
    if (debouncedSearchTerm)
      mutate(debouncedSearchTerm, { onSuccess: (results) => setSearchResults(results) });
  }, [debouncedSearchTerm, mutate]);

  useEffect(() => {
    if (selectedMovie !== null) setShouldNavigate(true);

    if (selectedMovie !== null && shouldNavigate) {
      navigate(`./movies/${selectedMovie.movie_id}`);
      setSelectedMovie(null);
      setSearchResults([]);
    }

    return () => setShouldNavigate(false);
  }, [selectedMovie, navigate, shouldNavigate]);

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
      value={selectedMovie}
      onChange={(_event, newValue) => setSelectedMovie(newValue)}
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
