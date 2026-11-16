export function vendoredFolder(fromRoot: string, vendored: string[]): string | undefined {
  return vendored
    .map((folder) => folder.replace(/\/+$/u, ''))
    .find((folder) => fromRoot.startsWith(`${folder}/`));
}
