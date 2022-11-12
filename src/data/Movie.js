import axios from './axios';
import { formatItemDates } from '../utils/itemDateUtil';

const getMovies = async (status) => {
  const res = await axios({
    method: 'get',
    url: `/list/movies/${status}`,
  });
  return res.data.results;
};

const getMovieDetails = async (movieId) => {
  const res = await axios({
    method: 'get',
    url: `/list/movies/movie/${movieId}`,
  });
  return formatItemDates(res.data.results[0]);
};

const addMovie = async (movie) => {
  const res = await axios({
    method: 'post',
    url: '/list/movies/add',
    data: movie,
  });
  return res.data;
};

const updateMovie = async (movieId, movie) => {
  const res = await axios({
    method: 'put',
    url: `/list/movies/update/${movieId}`,
    data: formatItemDates(movie),
  });
  return res.data.results[0];
};

const deleteMovie = async (movieId) => {
  const res = await axios({
    method: 'delete',
    url: `/list/movies/delete/${movieId}`,
  });
  return res.data;
};

const searchMovies = async (query) => {
  const res = await axios({
    method: 'get',
    url: `/list/movies/search?query=${query}`,
  });
  return res.data.results;
};

export { getMovies, getMovieDetails, addMovie, updateMovie, deleteMovie, searchMovies };
