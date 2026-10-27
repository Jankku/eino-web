import '@testing-library/jest-dom/vitest';
import { StrictMode } from 'react';
import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requestNavigationFocus, useNavigationFocus } from '../useNavigationFocus';
import { readItemFocus } from '../useRestoreItemFocus';

function Router({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <MemoryRouter initialEntries={['/books']}>{children}</MemoryRouter>
    </StrictMode>
  );
}

function useTestNavigation() {
  useNavigationFocus();
  return useNavigate();
}

function Content({ path, item, modal = false }: { path?: string; item?: string; modal?: boolean }) {
  return (
    <>
      <main id="main-content" tabIndex={-1}>
        {path ? <span hidden data-route-ready={path} /> : null}
        <h1>Books</h1>
        <h2 data-detail-heading={path?.includes('/books/') || undefined} tabIndex={-1}>
          Item detail
        </h2>
        {item ? (
          <a href={`/books/${item}`} id={item}>
            Origin item
          </a>
        ) : null}
        <button>Keep focus</button>
      </main>
      {modal ? <div role="dialog" aria-modal="true" aria-label="Navigation" /> : null}
    </>
  );
}

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
});

function originState(id = 'one') {
  return { libraryItemFocus: { id, pathname: '/books' } };
}

describe('navigation focus', () => {
  it('waits for committed async detail content and prefers it over the split-view h1', async () => {
    const view = render(<Content path="/books" />);
    const { result } = renderHook(useTestNavigation, { wrapper: Router });
    act(() => {
      void result.current('/books/one', { state: originState() });
    });
    await act(async () => {
      await new Promise(requestAnimationFrame);
    });
    expect(screen.getByRole('heading', { name: 'Books' })).not.toHaveFocus();
    view.rerender(<Content path="/books/one" />);
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Item detail' })).toHaveFocus());
    // Background refetches and query changes must not move focus again.
    screen.getByRole('button').focus();
    view.rerender(<Content path="/books/one" item="one" />);
    act(() => {
      void result.current('/books/one?sort=score&page=2');
    });
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('focuses the heading when moving between main pages', async () => {
    render(<Content path="/movies" />);
    const { result } = renderHook(useTestNavigation, { wrapper: Router });
    act(() => {
      void result.current('/movies');
    });
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Books' })).toHaveFocus());
  });

  it('focuses each different detail, even while the desktop list stays mounted', async () => {
    const view = render(<Content path="/books/one" item="one" />);
    const { result } = renderHook(useTestNavigation, { wrapper: Router });
    act(() => {
      void result.current('/books/one', { state: originState() });
    });
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Item detail' })).toHaveFocus());
    screen.getByRole('button').focus();
    view.rerender(<Content path="/books/two" item="one" />);
    act(() => {
      void result.current('/books/two');
    });
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Item detail' })).toHaveFocus());
  });

  it.each([false, true])(
    'restores the origin on Back after async list availability (list initially ready: %s)',
    async (ready) => {
      const view = render(<Content path="/books/one" />);
      const { result } = renderHook(useTestNavigation, { wrapper: Router });
      act(() => {
        void result.current('/books/one', { state: originState() });
      });
      await waitFor(() =>
        expect(screen.getByRole('heading', { name: 'Item detail' })).toHaveFocus(),
      );
      view.rerender(
        <Content path={ready ? '/books' : undefined} item={ready ? 'one' : undefined} />,
      );
      act(() => {
        void result.current(-1);
      });
      if (!ready) view.rerender(<Content path="/books" item="one" />);
      await waitFor(() => expect(screen.getByRole('link', { name: 'Origin item' })).toHaveFocus());
    },
  );

  it.each(['deleted', 'off-page'])(
    'falls back to the list heading for an %s origin',
    async (id) => {
      const view = render(<Content path={`/books/${id}`} />);
      const { result } = renderHook(useTestNavigation, { wrapper: Router });
      act(() => {
        void result.current(`/books/${id}`, { state: originState(id) });
      });
      await waitFor(() =>
        expect(screen.getByRole('heading', { name: 'Item detail' })).toHaveFocus(),
      );
      view.rerender(<Content path="/books" item="another" />);
      act(() => {
        void result.current('/books');
      });
      await waitFor(() => expect(screen.getByRole('heading', { name: 'Books' })).toHaveFocus());
    },
  );

  it('waits for modal removal before focusing a linked destination', async () => {
    const view = render(<Content path="/books/one" modal />);
    const { result } = renderHook(useTestNavigation, { wrapper: Router });
    act(() => {
      void result.current('/books/one', { state: originState() });
    });
    expect(screen.getByRole('heading', { name: 'Item detail' })).not.toHaveFocus();
    view.rerender(<Content path="/books/one" />);
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Item detail' })).toHaveFocus());
  });

  it('cancels pending placement when the user resumes interaction during loading', async () => {
    const view = render(<Content />);
    const { result } = renderHook(useTestNavigation, { wrapper: Router });
    act(() => {
      void result.current('/books/one', { state: originState() });
    });
    screen.getByRole('button').focus();
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Tab' });
    view.rerender(<Content path="/books/one" />);
    // Flush the observer and animation frame that would otherwise steal focus.
    await act(async () => {
      await new Promise(requestAnimationFrame);
    });
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('supports explicit re-selection of the current detail without a pathname change', async () => {
    render(<Content path="/books/one" />);
    screen.getByRole('button').focus();
    requestNavigationFocus('/books/one');
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Item detail' })).toHaveFocus());
  });

  it('focuses a direct detail visit under StrictMode', async () => {
    render(<Content path="/books/one" />);
    renderHook(useTestNavigation, {
      wrapper: ({ children }) => (
        <StrictMode>
          <MemoryRouter initialEntries={['/books/one']}>{children}</MemoryRouter>
        </StrictMode>
      ),
    });
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Item detail' })).toHaveFocus());
  });

  it('restores the correct history origin after choosing A, then B, then Back to A', async () => {
    const view = render(<Content path="/books/one" item="one" />);
    const { result } = renderHook(useTestNavigation, { wrapper: Router });
    act(() => {
      void result.current('/books/one', { state: originState() });
    });
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Item detail' })).toHaveFocus());
    view.rerender(<Content path="/books/two" item="one" />);
    act(() => {
      void result.current('/books/two', { state: originState('two') });
    });
    await act(async () => {
      await new Promise(requestAnimationFrame);
    });
    view.rerender(<Content path="/books/one" item="one" />);
    act(() => {
      void result.current(-1);
    });
    await act(async () => {
      await new Promise(requestAnimationFrame);
    });
    view.rerender(<Content path="/books" item="one" />);
    act(() => {
      void result.current(-1);
    });
    await waitFor(() => expect(screen.getByRole('link', { name: 'Origin item' })).toHaveFocus());
  });

  it('ignores unrelated routes and missing or malformed history origins', () => {
    const origin = originState().libraryItemFocus;
    expect(readItemFocus('/profile', '/books', origin)).toBeNull();
    expect(readItemFocus('/books/one', '/movies', origin)).toBeNull();
    expect(readItemFocus('/books/two', '/books', origin)).toBeNull();
    expect(readItemFocus('/books/one', '/books', undefined)).toBeNull();
    expect(readItemFocus('/books/one', '/books', { id: 1 })).toBeNull();
  });
});
