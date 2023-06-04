export function stringOrPlaceholder(value) {
  return value && String(value).length > 0 ? String(value) : '-';
}
