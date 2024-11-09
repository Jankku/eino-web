import { describe, expect, it } from 'vitest';
import { useRedirect } from '../useRedirect';
import { renderHook } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

const ValidRouter = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={['/?redirectTo=/profile']}>{children}</MemoryRouter>
);

const InvalidRouter = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={['/?redirectTo=google.com']}>{children}</MemoryRouter>
);

describe('useRedirect', () => {
  it('should resolve /books by default', () => {
    const { result } = renderHook(() => useRedirect(), {
      wrapper: BrowserRouter,
    });
    const redirectTo = result.current;
    expect(redirectTo).toBe('/books');
  });

  it('should resolve /books when redirectTo is google.com', () => {
    const { result } = renderHook(() => useRedirect(), {
      wrapper: InvalidRouter,
    });
    const redirectTo = result.current;
    expect(redirectTo).toBe('/books');
  });

  it('should resolve /profile when redirectTo is /profile', () => {
    const { result } = renderHook(() => useRedirect(), {
      wrapper: ValidRouter,
    });
    const redirectTo = result.current;
    expect(redirectTo).toBe('/profile');
  });
});
