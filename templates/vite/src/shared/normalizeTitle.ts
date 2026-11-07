export function normalizeTitle(title: string): string {
  return title.trim().replaceAll(/\s+/gu, ' ');
}
