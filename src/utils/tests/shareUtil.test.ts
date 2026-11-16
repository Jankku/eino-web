import { describe, expect, it } from 'vitest';
import { getShareUrl } from '../shareUtil';

describe('shareUtil', () => {
  describe('getShareUrl', () => {
    it('should return the correct url', () => {
      const result = new URL('api/v2/share/123', import.meta.env.VITE_BASE_URL).toString();
      expect(getShareUrl('123')).toBe(result);
    });
  });
});
