export function stringOrPlaceholder(value) {
  return value !== undefined && value !== null && String(value).length > 0 ? String(value) : '-';
}
