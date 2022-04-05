export function stringOrPlaceholder(value) {
  if (typeof value === 'string') {
    return value.length > 0 ? value : '-';
  } else {
    return '-';
  }
}
