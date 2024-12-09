import { useMemo } from 'react';
import { useLocation } from 'react-router';

const DEFAULT_REDIRECT = '/books';
const ALLOWED_REDIRECTS = ['/books', '/movies', '/profile'];

const getRedirect = (redirectTo: string | null) => {
  if (!redirectTo) return DEFAULT_REDIRECT;
  const isAllowed = ALLOWED_REDIRECTS.some((allowedRedirect) =>
    redirectTo.startsWith(allowedRedirect),
  );
  return isAllowed ? redirectTo : DEFAULT_REDIRECT;
};

export function useRedirect() {
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get('redirectTo');
  return useMemo(() => getRedirect(redirectTo), [redirectTo]);
}
