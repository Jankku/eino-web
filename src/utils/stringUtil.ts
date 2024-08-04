export function stringOrPlaceholder(value?: string | number | null): string {
  return value !== undefined && value !== null && String(value).length > 0 ? String(value) : '-';
}
