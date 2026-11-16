import eslintRules from 'oxlint-plugin-eslint';

export function restrictedSyntaxPlugin(name: string) {
  return {
    meta: { name },
    rules: { 'no-restricted-syntax': eslintRules.rules['no-restricted-syntax'] },
  };
}
