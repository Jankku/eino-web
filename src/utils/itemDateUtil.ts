import { DateTime } from 'luxon';

export function formatItemDates<T extends { start_date: string; end_date: string }>(item: T) {
  const copy = { ...item };
  copy.start_date = DateTime.fromISO(copy.start_date).toLocal().toISODate()!;
  copy.end_date = DateTime.fromISO(copy.end_date).toLocal().toISODate()!;
  return copy;
}
