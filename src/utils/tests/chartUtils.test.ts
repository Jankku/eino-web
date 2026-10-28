import { describe, expect, it } from 'vitest';
import { getCountAxis } from '../chartUtils';

describe('getCountAxis', () => {
  it.each([{ counts: [] }, { counts: [0, 0, 0] }, { counts: [1] }])(
    'provides a usable integer axis for $counts',
    ({ counts }) => {
      expect(getCountAxis(counts)).toEqual({ max: 4, ticks: [0, 1, 2, 3, 4] });
    },
  );

  it.each([
    { counts: [2, 7], max: 8, ticks: [0, 2, 4, 6, 8] },
    { counts: [42, 8], max: 50, ticks: [0, 10, 20, 30, 40, 50] },
    { counts: [1234], max: 1500, ticks: [0, 500, 1000, 1500] },
  ])('uses readable ticks covering every count in $counts', ({ counts, max, ticks }) => {
    expect(getCountAxis(counts)).toEqual({ max, ticks });
  });
});
