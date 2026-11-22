import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

export function colorFiles(files: string[]): OxlintConfig {
  return defineConfig({
    overrides: [{ files, rules: { 'theme-colors/no-restricted-syntax': 'off' } }],
  });
}
