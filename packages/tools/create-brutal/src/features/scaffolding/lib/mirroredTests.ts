import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE_ROOT = 'src/';
const TEST_ROOT = 'test/unit/';
const SOURCE_EXTENSION = /\.tsx?$/u;
const TEST_SUFFIXES = ['.test.ts', '.test.tsx'];

export function mirrorOf(source: string): string | undefined {
  return source.startsWith(SOURCE_ROOT)
    ? `${TEST_ROOT}${source.slice(SOURCE_ROOT.length)}`
    : undefined;
}

export function mirroredTests(dir: string, source: string): string[] {
  const mirror = mirrorOf(source);
  if (mirror === undefined || !existsSync(join(dir, source))) return [];
  if (statSync(join(dir, source)).isDirectory()) {
    return existsSync(join(dir, mirror)) ? [mirror] : [];
  }
  if (!SOURCE_EXTENSION.test(source)) return [];
  const stem = mirror.replace(SOURCE_EXTENSION, '');
  return TEST_SUFFIXES.map((suffix) => `${stem}${suffix}`).filter((test) =>
    existsSync(join(dir, test)),
  );
}

export function movedTest(test: string, source: string, target: string): string | undefined {
  const targetMirror = mirrorOf(target);
  if (targetMirror === undefined) return undefined;
  if (test === mirrorOf(source)) return targetMirror;
  return `${targetMirror.replace(SOURCE_EXTENSION, '')}${test.slice(test.lastIndexOf('.test.'))}`;
}
