export const getPaginationUrl = ({ path, searchParams, page }) => {
  const newSearchParams = new URLSearchParams(searchParams);
  newSearchParams.set('page', page);
  return `${path}?${newSearchParams.toString()}`;
};
