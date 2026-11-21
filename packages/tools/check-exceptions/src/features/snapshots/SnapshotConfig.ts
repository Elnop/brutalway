export const DIRECTIVE_PATTERN =
  '(//|/\\*)[[:space:]]*((oxlint|eslint|stylelint)-disable(-next-line|-line)?([[:space:]]+[-@/.,_[:alnum:]]+)*|@ts-(expect-error|ignore|nocheck)|jscpd:ignore-start|gitleaks:allow)';

export const CODE_FILES = [
  '*.ts',
  '*.tsx',
  '*.mts',
  '*.cts',
  '*.js',
  '*.jsx',
  '*.mjs',
  '*.cjs',
  '*.css',
  '*.vue',
];

export const DEFAULT_BRANCHES = ['origin/HEAD', 'origin/main', 'origin/master', 'main', 'master'];
