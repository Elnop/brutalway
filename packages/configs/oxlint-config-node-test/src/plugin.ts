import eslintRules from 'oxlint-plugin-eslint';

export default {
  meta: { name: 'node-test' },
  rules: { 'no-restricted-syntax': eslintRules.rules['no-restricted-syntax'] },
};
