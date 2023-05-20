import { DateTime } from 'luxon';

const initialMovieState = {
  title: '',
  studio: '',
  director: '',
  writer: '',
  image_url: '',
  duration: 0,
  year: DateTime.now().year,
  status: 'watching',
  score: 0,
  start_date: DateTime.now().toISODate(),
  end_date: DateTime.now().toISODate(),
};

export default initialMovieState;
