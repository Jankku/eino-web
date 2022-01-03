import { Autocomplete, createFilterOptions, ListItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieController from '../../data/MovieController';
import useDebounce from '../../utils/useDebounce';
import SearchTextField from '../common/SearchTextField';

function MovieSearch() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) =>
      `${option.title} ${option.studio} ${option.director} ${option.writer}`,
    trim: true,
  });

  const search = async (searchTerm) => {
    const res = await MovieController.searchMovies(searchTerm);
    setSearchResults(res.data.results);
  };

  useEffect(() => {
    if (isOpen && debouncedSearchTerm.trim().length > 0)
      search(debouncedSearchTerm);
  }, [debouncedSearchTerm, isOpen]);

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
      sx={{ width: { xs: '10em', sm: '15em', md: '20em' } }}
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      options={searchResults}
      isOptionEqualToValue={(option, value) =>
        option.movie_id === value.movie_id
      }
      value={selectedMovie}
      onChange={(_event, newValue) => {
        setSelectedMovie(newValue);
      }}
      filterOptions={filterOptions}
      getOptionLabel={(option) => option.title}
      inputValue={String(searchTerm)}
      onInputChange={(e) => {
        const value = e?.target?.value ?? '';
        setSearchTerm(value);
      }}
      renderInput={(params) => (
        <SearchTextField params={{ ...params }} label="Search movies" />
      )}
      renderOption={(props, option) => (
        <ListItem {...props} key={option.movie_id}>
          {option.title}
        </ListItem>
      )}
    />
  );
}

export default MovieSearch;
