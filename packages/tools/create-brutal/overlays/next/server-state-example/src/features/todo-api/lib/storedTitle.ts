export function storedTitle(title: unknown): string | undefined {
  if (typeof title !== 'string') return undefined;
  const normalized = title.trim().replaceAll(/\s+/gu, ' ');
  return normalized === '' || normalized.length > 200 ? undefined : normalized;
}
