import eslintRules from 'oxlint-plugin-eslint';

export default { meta: { name: 'hook-files' }, rules: { 'no-restricted-syntax': eslintRules.rules['no-restricted-syntax'] } };
