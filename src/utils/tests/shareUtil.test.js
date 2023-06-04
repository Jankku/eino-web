import { describe, expect, it } from 'vitest';
import { getShareUrl, blobToBase64 } from '../shareUtil';

describe('shareUtil', () => {
  describe('getShareUrl', () => {
    it('should return the correct url', () => {
      const result = new URL('share/123', import.meta.env.VITE_BASE_URL).toString();
      expect(getShareUrl('123')).toBe(result);
    });
  });

  describe('blobToBase64', () => {
    it('should return the correct base64 string', async () => {
      const blob = new Blob(['hello world'], { type: 'text/plain' });
      expect(await blobToBase64(blob)).toBe('data:text/plain;base64,aGVsbG8gd29ybGQ=');
    });
  });
});
