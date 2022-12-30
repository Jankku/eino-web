import { DateTime } from 'luxon';

const initialBookState = {
  isbn: '',
  title: '',
  author: '',
  publisher: '',
  pages: 0,
  year: DateTime.now().year,
  status: 'reading',
  score: 0,
  start_date: DateTime.now().toISODate(),
  end_date: DateTime.now().toISODate(),
};

export default initialBookState;
