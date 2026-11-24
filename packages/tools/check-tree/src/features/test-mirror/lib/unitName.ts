import { basename } from 'node:path';
import { SOURCE_FILE, TEST_FILE } from '#src/features/test-mirror/TestMirrorConfig.ts';
import { platformBase } from '#src/shared/platform-variants/platformBase.ts';

export function isSource(fileName: string): boolean {
  return SOURCE_FILE.test(fileName) && !TEST_FILE.test(fileName) && !fileName.endsWith('.d.ts');
}

export function unitName(file: string, platforms: readonly string[] | undefined): string {
  const fileName = basename(file).replace(TEST_FILE, '.ts');
  return platformBase(fileName, platforms).replace(SOURCE_FILE, '');
}
