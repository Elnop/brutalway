import { stripVTControlCharacters } from 'node:util';

const WARNING_LINE = /^\s*(?:npm )?warn(?:ing)?\b/imu;
const WARNING_COUNT = /\b[1-9]\d* warnings?\b/iu;

export function hasWarning(output: string): boolean {
  const text = stripVTControlCharacters(output);
  return WARNING_LINE.test(text) || WARNING_COUNT.test(text);
}
