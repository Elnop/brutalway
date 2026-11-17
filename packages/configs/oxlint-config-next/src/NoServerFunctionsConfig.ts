import { fileURLToPath } from 'node:url';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';
import { noServerFunctionsRules } from '#src/features/no-server-functions/NoServerFunctionsConfig.ts';

export const noServerFunctionsConfig: OxlintConfig = defineConfig({
  jsPlugins: [
    {
      name: 'server-actions',
      specifier: fileURLToPath(new URL('./serverActionsPlugin.js', import.meta.url)),
    },
  ],
  overrides: [{ files: ['**/*.ts', '**/*.tsx'], rules: noServerFunctionsRules }],
});
