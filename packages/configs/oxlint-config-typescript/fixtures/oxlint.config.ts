import { typescriptConfig } from '@brutalway/oxlint-config-typescript';
import { defineConfig } from 'oxlint';

export default defineConfig({ extends: [typescriptConfig], ignorePatterns: ['line-width/**'] });
