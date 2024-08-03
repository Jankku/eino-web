export const useFilterSearchParams = (searchParams, param) => {
  const newSearchParams = new URLSearchParams(searchParams);
  newSearchParams.delete(param);
  return newSearchParams;
};
