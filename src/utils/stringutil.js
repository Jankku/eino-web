export function stringOrPlaceholder(value) {
  return String(value).length > 0 ? String(value) : '-';
}
