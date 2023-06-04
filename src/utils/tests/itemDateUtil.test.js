import { describe, expect, it } from 'vitest';
import { formatItemDates } from '../itemDateUtil';
import { Settings } from 'luxon';
import '@testing-library/jest-dom';

describe('itemDateUtil', () => {
  beforeAll(() => {
    Settings.defaultZoneName = 'UTC+3';
  });
  afterAll(() => {
    Settings.defaultZoneName = 'local';
  });

  describe('formatItemDates', () => {
    it('should format dates correctly', () => {
      const input = {
        start_date: '2023-06-01T16:00:00.000Z',
        end_date: '2023-06-02T11:00:00.000Z',
      };
      expect(formatItemDates(input)).toEqual({
        start_date: '2023-06-01',
        end_date: '2023-06-02',
      });
    });
  });
});
