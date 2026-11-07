import { createRequire } from 'node:module';

const sonarRule: unknown = createRequire(import.meta.url)('eslint-plugin-sonarjs/cjs/S3776/rule.js');

export default {
  meta: { name: 'sonarjs' },
  rules: { 'cognitive-complexity': typeof sonarRule === 'object' && sonarRule !== null ? Reflect.get(sonarRule, 'rule') : undefined },
};
