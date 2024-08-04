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
