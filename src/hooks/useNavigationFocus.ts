import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { readItemFocus } from './useRestoreItemFocus';

export function focusNavigationTarget(target: HTMLElement) {
  if (
    !target.hasAttribute('tabindex') &&
    !target.matches('a[href], button, input, select, textarea')
  ) {
    target.tabIndex = -1;
  }
  target.setAttribute('data-navigation-focus', '');
  target.focus({ preventScroll: true });
  target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

// Head marks committed route content, including Suspense and nested detail routes.
// A single coordinator owns both route focus and list restoration on all layouts.
export function useNavigationFocus() {
  const { pathname, state } = useLocation();
  const originRef = useRef<unknown>(state?.libraryItemFocus);
  const previousRouteRef = useRef({ pathname, origin: state?.libraryItemFocus as unknown });

  useEffect(() => {
    originRef.current = state?.libraryItemFocus;
  }, [state]);

  useEffect(() => {
    const previous = previousRouteRef.current;
    previousRouteRef.current = { pathname, origin: originRef.current };
    // Preserve the normal first Tab to the skip link on an initial main-page visit.
    if (previous.pathname === pathname && !/^\/(books|movies)\/[^/]+$/.test(pathname)) return;

    return requestNavigationFocus(pathname, previous.pathname, previous.origin);
  }, [pathname]);
}

// Search can explicitly request placement when it selects the already-open item,
// which does not change the pathname. Share the same async/modal coordination.
export function requestNavigationFocus(pathname: string, previousPath = '', origin?: unknown) {
  const saved = readItemFocus(previousPath, pathname, origin);
  let frame = 0;
  let finished = false;
  const stop = () => {
    finished = true;
    observer.disconnect();
    cancelAnimationFrame(frame);
    document.removeEventListener('keydown', cancelForInteraction, true);
    document.removeEventListener('pointerdown', cancelForInteraction, true);
  };
  const cancelForInteraction = () => {
    // Do not move focus later if the user has already resumed interacting.
    stop();
  };
  const attempt = () => {
    if (finished) return;
    const main = document.getElementById('main-content');
    const ready = Array.from(main?.querySelectorAll<HTMLElement>('[data-route-ready]') ?? []).find(
      (node) => node.dataset.routeReady === pathname && !node.closest('[style*="display: none"]'),
    );
    if (!main || !ready || document.querySelector('[aria-modal="true"]')) return;
    const heading =
      main.querySelector<HTMLElement>('[data-route-heading], [data-detail-heading]') ??
      main.querySelector<HTMLElement>('h1');
    const item = saved ? document.getElementById(saved.id) : null;
    // The ready marker commits with the list, so a missing/off-page item can
    // fall back immediately instead of waiting indefinitely for a deleted item.
    const target = item && main.contains(item) ? item : (heading ?? main);
    stop();
    focusNavigationTarget(target);
  };
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(attempt);
  };
  const observer = new MutationObserver(schedule);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-modal', 'style', 'data-route-ready'],
  });
  document.addEventListener('keydown', cancelForInteraction, true);
  document.addEventListener('pointerdown', cancelForInteraction, true);
  schedule();
  return stop;
}
