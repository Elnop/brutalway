import { deepStrictEqual } from 'node:assert';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutal/lint-utils/lintFixture';

test('fastifyConfig checks env access, dependencies, async handlers, fetch outside clients, schemas and routes placement', () => {
  deepStrictEqual(lintFixture(fileURLToPath(new URL('fixtures', import.meta.url))), [
    'features/list/listRoutes.ts:5 fastify-conventions(no-restricted-syntax)',
    'features/list/listRoutes.ts:7 fastify-conventions(no-restricted-syntax)',
    'features/sync/syncHelper.ts:2 eslint(no-restricted-globals)',
    'helper.ts:1 export-placement(no-restricted-syntax)',
    'port.ts:2 fastify-conventions(no-restricted-syntax)',
    'relative.ts:1 eslint(no-restricted-imports)',
    'shared-features/todos/todosRoutes.ts:1 check-file(filename-blocklist)',
    'shared-features/todos/TodosSchemas.ts:6 export-placement(no-restricted-syntax)',
  ]);
});
