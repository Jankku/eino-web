import { api } from './api';
import { PaginatedResponse, PageParams } from './types';

export async function getPage<T>(
  path: string,
  params: PageParams,
  searchParams: Record<string, string> = {},
) {
  const response = await api
    .get(path, {
      searchParams: {
        ...Object.fromEntries(Object.entries(searchParams).filter(([, value]) => value !== '')),
        ...params,
      },
    })
    .json<PaginatedResponse<T>>();
  if (!response.pagination) {
    throw new Error('Pagination is unavailable. The backend pagination update must be deployed.');
  }
  return response;
}
