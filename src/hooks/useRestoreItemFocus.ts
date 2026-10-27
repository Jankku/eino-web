import { useLocation } from 'react-router';

export type SavedItemFocus = { id: string; pathname: string };
export type ItemNavigationState = { libraryItemFocus: SavedItemFocus };

// A history entry owns its origin: choosing another item must not overwrite the
// origin of an earlier entry, and profile/search links have no list origin.
export function readItemFocus(
  previousPath: string,
  pathname: string,
  origin: unknown,
): SavedItemFocus | null {
  if (pathname !== '/books' && pathname !== '/movies') return null;
  if (!origin || typeof origin !== 'object' || !('id' in origin) || !('pathname' in origin))
    return null;
  return typeof origin.id === 'string' &&
    origin.id.length > 0 &&
    origin.pathname === pathname &&
    previousPath === `${pathname}/${origin.id}`
    ? { id: origin.id, pathname }
    : null;
}

export function useRestoreItemFocus() {
  const { pathname } = useLocation();
  const getItemLinkState = (id: string): ItemNavigationState => ({
    libraryItemFocus: { id, pathname: '/' + pathname.split('/')[1] },
  });

  // The shared route-focus hook restores this origin after async list content
  // commits, on both layouts. Router history state also survives a reload.
  return { getItemLinkState };
}
