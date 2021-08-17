const initialBookFormState = {
  isbn: '',
  title: '',
  author: '',
  publisher: '',
  pages: 0,
  year: new Date().getFullYear(),
  status: 'reading',
  score: 0,
  start_date: new Date().toISOString(),
  end_date: new Date().toISOString(),
};

export default initialBookFormState;
