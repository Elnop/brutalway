export function docTitle(path: string): string {
  const segments = path.split('/');
  const name = (segments.at(-1) ?? path).replace(/\.md$/iu, '');
  const label = name.toLowerCase() === 'readme' ? (segments.at(-2) ?? 'Overview') : name;
  const words = label.replaceAll(/[-_]/gu, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}
