import { api } from './api';
import { PaginatedResponse, PageParams } from './types';

export async function getPage<T>(
  path: string,
  params: PageParams,
  searchParams: Record<string, string> = {},
) {
  return api
    .get(path, {
      searchParams: {
        ...Object.fromEntries(Object.entries(searchParams).filter(([, value]) => value !== '')),
        ...params,
      },
    })
    .json<PaginatedResponse<T>>();
}
