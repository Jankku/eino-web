const initialMovieFormState = {
  title: '',
  studio: '',
  director: '',
  writer: '',
  duration: 0,
  year: new Date().getFullYear(),
  status: 'watching',
  score: 0,
  start_date: new Date().toISOString(),
  end_date: new Date().toISOString(),
};

export default initialMovieFormState;
