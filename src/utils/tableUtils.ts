import { DateTime } from 'luxon';

export const jsonValueFormatter = (value: unknown) =>
  value ? JSON.stringify(value, undefined, 2) : '';

export const dateValueFormatter = (value: string | Date | null) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  return DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT);
};

export const booleanFormatter = (value: unknown) => !!value;

export const dateToISOStringParser = (value: Date) => DateTime.fromJSDate(value).toISO();
