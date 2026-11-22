import eslintRules from 'oxlint-plugin-eslint';

export default {
  meta: { name: 'store-selector' },
  rules: { 'no-restricted-syntax': eslintRules.rules['no-restricted-syntax'] },
};
