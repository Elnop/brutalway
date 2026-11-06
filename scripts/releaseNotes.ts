export function releaseNotes(changelog: string, version: string): string | undefined {
  const lines = changelog.split('\n');
  const start = lines.indexOf(`## ${version}`);
  if (start === -1) return undefined;
  const end = lines.findIndex((line, index) => index > start && line.startsWith('## '));
  return lines
    .slice(start + 1, end === -1 ? undefined : end)
    .join('\n')
    .trim();
}
