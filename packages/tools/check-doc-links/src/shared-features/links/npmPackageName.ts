const NPM_PAGE = /^https:\/\/(?:www\.)?npmjs\.com\/package\/((?:@[^/]+\/)?[^/?#]+)/iu;

export function npmPackageName(url: string): string | undefined {
  const name = NPM_PAGE.exec(url)?.[1];
  return name === undefined ? undefined : decodeURIComponent(name);
}
