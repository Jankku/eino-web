import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse } from '../types';
import { BookWithId } from '../../models/book';

const searchBooksQuery = async (query: string, signal: AbortSignal) => {
  const res = await api
    .get(`api/v2/list/books/search`, { searchParams: { query }, signal })
    .json<ApiResponse<BookWithId[]>>();
  return res.results;
};

export const useBookSearch = (query: string) => {
  return useQuery({
    queryKey: ['books', 'search', query],
    queryFn: ({ signal }) => searchBooksQuery(query, signal),
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
  });
};
