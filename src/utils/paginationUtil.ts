import { PageParams } from '../data/types';

export function getPageParams(searchParams: URLSearchParams, defaultPageSize: number): PageParams {
  const readInteger = (value: string | null, fallback: number, maximum: number) => {
    if (!value || !/^[1-9]\d*$/.test(value)) return fallback;
    const number = Number(value);
    return Number.isSafeInteger(number) && number <= maximum ? number : fallback;
  };
  const pageSize = readInteger(searchParams.get('pageSize'), defaultPageSize, 100);
  const page = readInteger(
    searchParams.get('page'),
    1,
    Math.floor(Number.MAX_SAFE_INTEGER / pageSize),
  );
  return { page, pageSize };
}

export const getPaginationUrl = ({
  path,
  searchParams,
  page,
}: {
  path: string;
  searchParams: URLSearchParams;
  page: number;
}) => {
  const newSearchParams = new URLSearchParams(searchParams);
  newSearchParams.set('page', page.toString());
  return `${path}?${newSearchParams.toString()}`;
};
