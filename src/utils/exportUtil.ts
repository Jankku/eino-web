import { DateTime } from 'luxon';

export const createJsonBlob = (data: unknown) => {
  return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
};

export const generateExportFileName = () => {
  return `eino-export-${DateTime.now().toFormat("yyyyLLdd'-'HHmmss")}.json`;
};
