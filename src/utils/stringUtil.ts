export function stringOrPlaceholder(value?: string | number | null): string {
  return value !== undefined && value !== null && String(value).length > 0 ? String(value) : '-';
}

export const underscoreToSpace = (value: string) => value.replace(/_/g, ' ');
