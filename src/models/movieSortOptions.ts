import movieStatus from './movieStatus';

export const movieSortStatuses = [{ value: 'all', name: 'All' }, ...movieStatus];

export const movieSortFields = [
  { name: 'Title', value: 'title' },
  { name: 'Studio', value: 'studio' },
  { name: 'Director', value: 'director' },
  { name: 'Writer', value: 'writer' },
  { name: 'Duration', value: 'duration' },
  { name: 'Release year', value: 'year' },
  { name: 'Status', value: 'status' },
  { name: 'Score', value: 'score' },
  { name: 'Start Date', value: 'start_date' },
  { name: 'End Date', value: 'end_date' },
];
