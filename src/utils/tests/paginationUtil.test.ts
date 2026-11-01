import { describe, expect, it } from 'vitest';
import { getPageParams, getPaginationUrl } from '../paginationUtil';

describe('getPageParams', () => {
  it('uses the view defaults and accepts API-compatible positive integers', () => {
    expect(getPageParams(new URLSearchParams(), 25)).toEqual({ page: 1, pageSize: 25 });
    expect(getPageParams(new URLSearchParams('page=3&pageSize=100'), 25)).toEqual({
      page: 3,
      pageSize: 100,
    });
  });

  it('replaces the retired page size from existing URLs with the view default', () => {
    expect(getPageParams(new URLSearchParams('page=2&pageSize=21'), 25)).toEqual({
      page: 2,
      pageSize: 25,
    });
  });

  it.each(['0', '-1', '1.5', '1e2', '2x', '01', 'Infinity', '9007199254740992'])(
    'normalizes invalid URL value %s',
    (value) => {
      const searchParams = new URLSearchParams({ page: value, pageSize: value });
      expect(getPageParams(searchParams, 25)).toEqual({ page: 1, pageSize: 25 });
    },
  );

  it('rejects oversized page sizes and unsafe offsets', () => {
    expect(getPageParams(new URLSearchParams('page=9007199254740991&pageSize=101'), 50)).toEqual({
      page: 1,
      pageSize: 50,
    });
  });
});

describe('getPaginationUrl', () => {
  it('preserves sort, order, filter and page size without mutating existing params', () => {
    const searchParams = new URLSearchParams(
      'sort=score&order=descending&filter=score%3A%3E%3A5&pageSize=25&page=1',
    );
    const url = new URL(
      getPaginationUrl({ path: '/books', searchParams, page: 2 }),
      'http://localhost',
    );
    expect(Object.fromEntries(url.searchParams)).toEqual({
      sort: 'score',
      order: 'descending',
      filter: 'score:>:5',
      pageSize: '25',
      page: '2',
    });
    expect(searchParams.get('page')).toBe('1');
  });
});
