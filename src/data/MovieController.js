import axios from './axios';

const MovieController = {
  async getMoviesByStatus(movieSortStatus) {
    return await axios({
      method: 'get',
      url: `/api/list/movies/${movieSortStatus}`,
    });
  },

  async getMovieDetails(movieId) {
    return await axios({
      method: 'get',
      url: `/api/list/movies/movie/${movieId}`,
    });
  },

  async addMovie(formData) {
    await axios({
      method: 'post',
      url: '/api/list/movies/add',
      data: formData,
    });
  },

  async updateMovie(movieId, movie) {
    await axios({
      method: 'put',
      url: `/api/list/movies/update/${movieId}`,
      data: movie,
    });
  },

  async deleteMovie(movieId) {
    await axios({
      method: 'delete',
      url: `/api/list/movies/delete/${movieId}`,
    });
  },
};

export default MovieController;
