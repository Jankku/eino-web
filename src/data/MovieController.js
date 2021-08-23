import axios from './axios';

const MovieController = {
  async getMoviesByStatus(movieSortStatus, token) {
    return await axios({
      method: 'get',
      url: `/api/list/movies/${movieSortStatus}`,
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
  },

  async getMovieDetails(movieId, token) {
    return await axios({
      method: 'get',
      url: `/api/list/movies/movie/${movieId}`,
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
  },

  async addMovie(token, formData) {
    await axios({
      method: 'post',
      url: '/api/list/movies/add',
      headers: {
        Authorization: `bearer ${token}`,
      },
      data: formData,
    });
  },

  async updateMovie(movieId, token, movie) {
    await axios({
      method: 'put',
      url: `/api/list/movies/update/${movieId}`,
      headers: {
        Authorization: `bearer ${token}`,
      },
      data: movie,
    });
  },

  async deleteMovie(movieId, token) {
    await axios({
      method: 'delete',
      url: `/api/list/movies/delete/${movieId}`,
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
  },
};

export default MovieController;
