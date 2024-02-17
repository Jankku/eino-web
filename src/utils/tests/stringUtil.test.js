import { describe, expect, it } from 'vitest';
import { stringOrPlaceholder } from '../stringutil';

describe('stringUtil', () => {
  describe('stringOrPlaceholder', () => {
    it('should return string if not empty', () => {
      expect(stringOrPlaceholder('test')).toBe('test');
    });

    it('should return 0', () => {
      expect(stringOrPlaceholder(0)).toBe('0');
    });

    it('should return placeholder if empty', () => {
      expect(stringOrPlaceholder('')).toBe('-');
      expect(stringOrPlaceholder(null)).toBe('-');
      expect(stringOrPlaceholder(undefined)).toBe('-');
    });
  });
});
