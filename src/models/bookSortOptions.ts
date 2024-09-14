import bookStatus from './bookStatus';

export const bookSortStatuses = [{ value: 'all', name: 'All' }, ...bookStatus];

export const bookSortFields = [
  { name: 'Title', value: 'title' },
  { name: 'Author', value: 'author' },
  { name: 'Publisher', value: 'publisher' },
  { name: 'Pages', value: 'pages' },
  { name: 'Released', value: 'year' },
  { name: 'Status', value: 'status' },
  { name: 'Score', value: 'score' },
  { name: 'Start Date', value: 'start_date' },
  { name: 'End Date', value: 'end_date' },
  { name: 'Created', value: 'created_on' },
];
