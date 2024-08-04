import { describe, expect, it } from 'vitest';
import { formatBookSearchQuery } from '../imageQueryUtil';

describe('imageQueryUtil', () => {
  describe('formatBookSearchQuery', () => {
    it('should format query correctly', () => {
      expect(formatBookSearchQuery('title', 'author')).toBe('author title');
      expect(formatBookSearchQuery('', 'author')).toBe('author');
      expect(formatBookSearchQuery('title', '')).toBe('title');
      expect(formatBookSearchQuery('', '')).toBe('');
    });
  });
});
