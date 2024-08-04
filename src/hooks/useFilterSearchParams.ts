export const useFilterSearchParams = (searchParams: URLSearchParams, param: string) => {
  const newSearchParams = new URLSearchParams(searchParams);
  newSearchParams.delete(param);
  return newSearchParams;
};
