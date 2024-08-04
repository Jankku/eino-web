import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import { Settings } from 'luxon';
import { generateExportFileName, createJsonBlob } from '../exportUtil';

describe('exportUtil', () => {
  beforeAll(() => {
    Settings.now = () => new Date(2023, 5, 2, 12, 34, 56).valueOf();
  });
  afterAll(() => {
    Settings.now = () => Date.now();
  });

  describe('generateExportFileName', () => {
    it('should generate correct filename', () => {
      expect(generateExportFileName()).toBe('eino-export-20230602-123456.json');
    });
  });

  describe('createJsonBlob', () => {
    it('should create a blob', () => {
      const blob = createJsonBlob({ foo: 'bar' });
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/json');
    });
  });
});
