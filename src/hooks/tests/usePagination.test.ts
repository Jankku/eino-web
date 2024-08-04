import { describe, expect, it, vi } from 'vitest';
import { usePagination } from '../usePagination';
import { renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

describe('usePagination', () => {
  it('should have correct initial state when items are empty', () => {
    const pageLength = 10;
    const { result } = renderHook(() => usePagination([], pageLength), {
      wrapper: BrowserRouter,
    });
    const [items, page, pageCount] = result.current;

    expect(items.length).toEqual(0);
    expect(page).toEqual(1);
    expect(pageCount).toEqual(1);
  });

  it('should have correct state when array is not empty', () => {
    const pageLength = 10;
    const { result } = renderHook(() => usePagination([1, 2, 3], pageLength), {
      wrapper: BrowserRouter,
    });
    const [items, page, pageCount] = result.current;

    expect(items.length).toEqual(3);
    expect(page).toEqual(1);
    expect(pageCount).toEqual(1);
  });

  it('should return correct items when page is 2', () => {
    vi.spyOn(URLSearchParams.prototype, 'get').mockImplementation(() => '2');
    const arrayItems = Array.from({ length: 20 }, (_, index) => index + 1);
    const pageLength = 10;
    const { result } = renderHook(() => usePagination(arrayItems, pageLength), {
      wrapper: BrowserRouter,
    });
    const [items, page, pageCount] = result.current;

    expect(items.length).toEqual(pageLength);
    expect(items).toEqual([...arrayItems.slice(10, 20)]);
    expect(page).toEqual(2);
    expect(pageCount).toEqual(2);
  });
});
