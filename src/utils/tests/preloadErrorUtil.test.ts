import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handlePreloadError } from '../preloadErrorUtil';

function failPreload() {
  const event = new Event('vite:preloadError', { cancelable: true });
  handlePreloadError(event);
  return event;
}

describe('handlePreloadError', () => {
  const reload = vi.fn();
  const storage = new Map<string, string>();
  const getItem = vi.fn((key: string) => storage.get(key) ?? null);
  const setItem = vi.fn((key: string, value: string) => storage.set(key, value));

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    storage.clear();
    vi.stubGlobal('window', {
      location: { reload },
      navigator: { onLine: true },
      sessionStorage: { getItem, setItem },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('persists the guard before reloading and suppresses the handled error', () => {
    reload.mockImplementationOnce(() => expect(setItem).toHaveBeenCalled());

    expect(failPreload().defaultPrevented).toBe(true);
    expect(reload).toHaveBeenCalledExactlyOnceWith();
  });

  it('leaves repeated errors unsuppressed during the cooldown', () => {
    failPreload();
    vi.advanceTimersByTime(59_999);

    expect(failPreload().defaultPrevented).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('allows recovery again after the cooldown', () => {
    failPreload();
    vi.advanceTimersByTime(60_000);

    expect(failPreload().defaultPrevented).toBe(true);
    expect(reload).toHaveBeenCalledTimes(2);
  });

  it('does not reload or suppress errors while offline', () => {
    Object.defineProperty(window.navigator, 'onLine', { value: false });

    expect(failPreload().defaultPrevented).toBe(false);
    expect(reload).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();
  });

  it.each(['read', 'write'])('does not reload if storage %s fails', (operation) => {
    const method = operation === 'read' ? getItem : setItem;
    method.mockImplementationOnce(() => {
      throw new DOMException('Storage unavailable', 'SecurityError');
    });

    expect(failPreload().defaultPrevented).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });
});
