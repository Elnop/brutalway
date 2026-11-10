import eslintRules from 'oxlint-plugin-eslint';

export default {
  meta: { name: 'export-placement' },
  rules: { 'no-restricted-syntax': eslintRules.rules['no-restricted-syntax'] },
};
