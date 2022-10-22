import { DateTime } from 'luxon';

export function formatItemDates(item) {
  const copy = { ...item };
  copy.start_date = DateTime.fromISO(copy.start_date).toLocal().toISODate();
  copy.end_date = DateTime.fromISO(copy.end_date).toLocal().toISODate();
  return copy;
}
