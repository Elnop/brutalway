type SystemPath = { path: string; initial: boolean };

export function redirectSystemPath({ path }: SystemPath): string {
  return path.replace('legacy/', '');
}
