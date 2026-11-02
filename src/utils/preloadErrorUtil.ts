const RELOAD_STORAGE_KEY = 'vite-preload-error:last-reload';
const RELOAD_COOLDOWN_MS = 60_000;

export function handlePreloadError(event: Event) {
  if (!window.navigator.onLine) return;

  const now = Date.now();

  try {
    const lastReload = window.sessionStorage.getItem(RELOAD_STORAGE_KEY);
    if (lastReload !== null && now - Number(lastReload) < RELOAD_COOLDOWN_MS) return;
    window.sessionStorage.setItem(RELOAD_STORAGE_KEY, String(now));
  } catch {
    return;
  }

  event.preventDefault();
  window.location.reload();
}
