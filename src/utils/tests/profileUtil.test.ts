import { describe, expect, it } from 'vitest';
import { formatWatchTime } from '../profileUtil';

describe('formatWatchTime', () => {
  it.each([
    [0, '0 hours'],
    [1, '1 hour'],
    [23, '23 hours'],
    [24, '1 day'],
    [25, '1 day 1 hour'],
    [48, '2 days'],
    [50, '2 days 2 hours'],
    [2.5, '2.5 hours'],
    [50.5, '2 days 2.5 hours'],
    [1562, '65 days 2 hours'],
  ])('formats %s hours as %s', (hours, expected) => {
    expect(formatWatchTime(hours)).toBe(expected);
  });
});
