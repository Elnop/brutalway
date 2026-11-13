import { reactConfig } from '@brutalway/oxlint-config-react';
import { vitestConfig } from '@brutalway/oxlint-config-vitest';
import { zustandConfig } from '@brutalway/oxlint-config-zustand';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';
import { clientBoundaryOverrides } from '#src/features/client-boundary/ClientBoundaryConfig.ts';
import { nextPluginRules } from '#src/features/next-plugin/NextPluginConfig.ts';
import { routeFilesOverrides } from '#src/features/route-files/RouteFilesConfig.ts';
import { serverActionsOverrides } from '#src/features/server-actions/ServerActionsConfig.ts';

export const nextConfig: OxlintConfig = defineConfig({
  extends: [reactConfig, zustandConfig, vitestConfig],
  plugins: ['typescript', 'react', 'import', 'oxc', 'unicorn', 'nextjs'],
  jsPlugins: [
    {
      name: 'client-boundary',
      specifier: fileURLToPath(new URL('./clientBoundaryPlugin.js', import.meta.url)),
    },
    {
      name: 'server-actions',
      specifier: fileURLToPath(new URL('./serverActionsPlugin.js', import.meta.url)),
    },
  ],
  env: { browser: true, es2024: true },
  rules: {
    ...nextPluginRules,
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            regex: '^\\.\\.?/',
            message: 'Relative imports are not allowed: import through an alias.',
          },
        ],
      },
    ],
    'import/default': 'off',
    'import/no-unassigned-import': ['error', { allow: ['**/*.css'] }],
    'typescript/no-non-null-assertion': 'off',
    'unicorn/prefer-add-event-listener': 'off',
  },
  overrides: [
    ...clientBoundaryOverrides,
    ...serverActionsOverrides,
    ...routeFilesOverrides,
    {
      files: ['e2e/**', '**/*.config.ts', '**/proxy.ts', '**/instrumentation.ts'],
      env: { node: true },
    },
    {
      files: ['**/instrumentation-client.ts'],
      rules: { 'unicorn/filename-case': 'off' },
    },
  ],
});
