import { describe, expect, it } from 'vitest';
import { readEinoImportFile } from '../importUtil';

const validContent = JSON.stringify({
  version: 1,
  profile: { username: 'tester' },
  books: [{}, {}],
  movies: [{}],
  shares: [],
});

describe('readEinoImportFile', () => {
  it('accepts a JSON file with application/json type', async () => {
    const file = new File([validContent], 'export.json', { type: 'application/json' });
    const { preview, fileErrors } = await readEinoImportFile(file);
    expect(fileErrors).toEqual([]);
    expect(preview).toEqual({ version: 1, bookCount: 2, movieCount: 1, username: 'tester' });
  });

  it('accepts a valid JSON file with an empty type', async () => {
    const file = new File([validContent], 'export.json', { type: '' });
    const { preview, fileErrors } = await readEinoImportFile(file);
    expect(fileErrors).toEqual([]);
    expect(preview).not.toBeNull();
  });

  it('accepts a .json file with a generic type', async () => {
    const file = new File([validContent], 'Export.JSON', { type: 'application/octet-stream' });
    const { fileErrors } = await readEinoImportFile(file);
    expect(fileErrors).toEqual([]);
  });

  it('rejects a non-JSON type without a .json extension', async () => {
    const file = new File([validContent], 'export.txt', { type: 'text/plain' });
    const { preview, fileErrors } = await readEinoImportFile(file);
    expect(preview).toBeNull();
    expect(fileErrors[0].code).toBe('invalid_file_type');
  });

  it('rejects invalid JSON content even with an empty type', async () => {
    const file = new File(['not json'], 'export.json', { type: '' });
    const { preview, fileErrors } = await readEinoImportFile(file);
    expect(preview).toBeNull();
    expect(fileErrors[0].code).toBe('invalid_file_type');
  });
});
