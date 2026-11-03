import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import { useAuthContext } from '../providers/AuthenticationProvider';

const ALLOWED_REDIRECTS = ['/books', '/movies', '/profile'];

const getRedirect = (redirectTo: string | null, role?: string | null) => {
  const defaultRedirect = role === 'admin' ? '/admin' : '/books';
  if (!redirectTo) return defaultRedirect;
  const allowedRedirects = role === 'admin' ? [...ALLOWED_REDIRECTS, '/admin'] : ALLOWED_REDIRECTS;
  const isAllowed = allowedRedirects.some(
    (path) =>
      redirectTo === path || redirectTo.startsWith(`${path}/`) || redirectTo.startsWith(`${path}?`),
  );
  return isAllowed ? redirectTo : defaultRedirect;
};

export function getLoginRedirect(accessToken: string, search: string) {
  const { role } = jwtDecode<{ role: string }>(accessToken);
  return getRedirect(new URLSearchParams(search).get('redirectTo'), role);
}

export function useRedirect() {
  const location = useLocation();
  const { role } = useAuthContext();
  const redirectTo = new URLSearchParams(location.search).get('redirectTo');
  return useMemo(() => getRedirect(redirectTo, role), [redirectTo, role]);
}
