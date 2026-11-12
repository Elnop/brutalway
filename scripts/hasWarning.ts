import { stripVTControlCharacters } from 'node:util';

const WARNING_LINE = /^\s*(?:npm )?warn(?:ing)?\b/imu;
const WARNING_COUNT = /\b[1-9]\d* warnings?\b/iu;
const TOLERATED_WARNINGS = [/^Warning: jscpd analyzed no files\b/u];

function isTolerated(line: string): boolean {
  return TOLERATED_WARNINGS.some((warning) => warning.test(line));
}

export function hasWarning(output: string): boolean {
  const text = stripVTControlCharacters(output)
    .split('\n')
    .filter((line) => !isTolerated(line))
    .join('\n');
  return WARNING_LINE.test(text) || WARNING_COUNT.test(text);
}
