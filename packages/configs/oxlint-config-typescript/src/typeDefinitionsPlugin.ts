import eslintRules from 'oxlint-plugin-eslint';

export default {
  meta: { name: 'type-definitions' },
  rules: { 'no-restricted-syntax': eslintRules.rules['no-restricted-syntax'] },
};
