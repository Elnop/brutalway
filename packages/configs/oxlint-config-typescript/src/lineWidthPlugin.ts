import eslintRules from 'oxlint-plugin-eslint';

export default {
  meta: { name: 'line-width' },
  rules: {
    'max-len': eslintRules.rules['max-len'],
    'no-restricted-syntax': eslintRules.rules['no-restricted-syntax'],
  },
};
