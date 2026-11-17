import { nextConfig } from '@brutalway/oxlint-config-next';
import { noServerFunctionsConfig } from '@brutalway/oxlint-config-next/no-server-functions';
import { defineConfig } from 'oxlint';

export default defineConfig({ extends: [nextConfig, noServerFunctionsConfig] });
