import type { Stack } from '../StackTypes.ts';

const NPM_TEST_ROW = '`node:test`: queries on an in-memory database, routes through `inject()`';
const ROW_ID_SENTENCE = " That is also why `src/shared-features/todos/todosQueries.ts` reads `row['id']`.";
const TEST_FILES_OPENING_A_DATABASE = ['src/shared-features/todos/todosQueries.test.ts', 'src/features/todo-list/todoListRoutes.test.ts', 'src/features/todo-stats/todoStatsRoutes.test.ts'];

export const fastifyStack: Stack = {
  id: 'fastify',
  label: 'Fastify API',
  repository: 'Elnop/template-fastify',
  submodule: 'templates/fastify',
  options: [
    { id: 'example', message: 'Keep the todo list API example?', default: true },
    { id: 'swagger', message: 'Serve a Swagger UI on /docs?', default: true },
    { id: 'database', message: 'Use SQLite (node:sqlite)? Without it, the example keeps its todos in memory.', default: true },
    { id: 'claude-hook', message: 'Add the Claude Code hook that lints each edited file?', default: true, independent: true },
    { id: 'ci', message: 'Add the GitHub Actions workflow?', default: true, independent: true },
  ],
  changes: [
    {
      when: {},
      edits: [{ file: 'README.md', replace: '# template-fastify\n', with: '# __PROJECT_NAME__\n' }],
    },
    {
      when: { example: false },
      remove: ['src/features', 'src/shared-features/todos', 'src/shared/ErrorSchemas.ts'],
      edits: [
        { file: 'src/app/buildApp.ts', dropLines: '#src/features/' },
        { file: 'src/app/buildApp.ts', dropLines: 'createTodosQueries' },
        { file: 'src/app/buildApp.ts', dropLines: 'Routes(create' },
        { file: 'src/app/buildApp.ts', replace: "'Todos API'", with: "'__PROJECT_NAME__'", all: true },
        { file: 'README.md', dropLines: 'The example is the todo list API' },
        { file: 'README.md', dropSection: '## Endpoints' },
        {
          file: 'README.md',
          replace:
            ' `src/shared-features/todos/` holds the schemas, the types and `todosQueries.ts`, the only file that runs SQL on the todos table. `src/features/todo-list/` and `src/features/todo-stats/` both use it without knowing each other.',
          with: '',
        },
        { file: 'README.md', replace: NPM_TEST_ROW, with: '`node:test`, routes through `inject()`' },
        { file: 'README.md', dropLines: '1. Delete `src/features/`' },
        { file: 'README.md', replace: '2. Add a shared feature', with: '1. Add a shared feature' },
        { file: 'README.md', replace: '3. Run `npm run check` often', with: '2. Run `npm run check` often' },
        { file: 'docs/verifications.md', replace: ROW_ID_SENTENCE, with: '' },
        { file: 'docs/verifications.md', dropLines: '| Queries |' },
        { file: 'docs/verifications.md', dropLines: '| Routes |' },
        {
          file: 'docs/architecture.md',
          replace: ' A request goes `src/features/todo-list/todoListRoutes.ts` → `src/features/todo-list/todoListService.ts` → `src/shared-features/todos/todosQueries.ts`, and only queries run SQL.',
          with: ' Only queries run SQL.',
        },
      ],
      keep: ['src/features', 'src/shared-features'],
    },
    {
      when: { example: false, swagger: true },
      overlay: 'skeleton-swagger',
    },
    {
      when: { example: false, swagger: false },
      overlay: 'skeleton-no-swagger',
    },
    {
      when: { example: true, swagger: false },
      overlay: 'example-no-swagger',
      edits: [{ file: 'README.md', replace: ', serialize the output and produce the OpenAPI document served on `/docs/json`.', with: ' and serialize the output.' }],
    },
    {
      when: { swagger: false },
      remove: ['src/shared/swaggerTheme.css'],
      edits: [
        { file: 'src/app/buildApp.ts', dropLines: 'readFileSync' },
        { file: 'src/app/buildApp.ts', dropLines: '@fastify/swagger' },
        { file: 'src/app/buildApp.ts', dropLines: 'jsonSchemaTransform' },
        { file: 'src/app/buildApp.ts', dropLines: 'SWAGGER_THEME' },
        { file: 'README.md', replace: ', and the Swagger UI on `/docs`.', with: '.' },
        { file: 'README.md', replace: ', routes, Swagger', with: ', routes' },
        { file: 'docs/verifications.md', replace: 'the full wiring and the OpenAPI document', with: 'the full wiring' },
      ],
      dependencies: ['@fastify/swagger-ui'],
    },
    {
      when: { example: true, database: false },
      overlay: 'memory-store',
      edits: [
        ...TEST_FILES_OPENING_A_DATABASE.flatMap((file) => [
          { file, dropLines: "import { openDatabase } from '#src/shared/lib/openDatabase.ts';" },
          { file, replace: "createTodosQueries(openDatabase(':memory:'))", with: 'createTodosQueries()' },
        ]),
        { file: 'src/app/buildApp.ts', replace: 'createTodosQueries(database)', with: 'createTodosQueries()' },
        { file: 'README.md', replace: 'the only file that runs SQL on the todos table', with: 'which keeps the todos in memory' },
        { file: 'README.md', replace: NPM_TEST_ROW, with: '`node:test`: queries, routes through `inject()`' },
        { file: 'docs/verifications.md', replace: ROW_ID_SENTENCE, with: '' },
        { file: 'docs/verifications.md', replace: 'the SQL, on a `:memory:` database', with: 'the in-memory store' },
      ],
    },
    {
      when: { database: false },
      remove: ['src/shared/lib/openDatabase.ts'],
      edits: [
        { file: 'src/app/buildApp.ts', dropLines: 'openDatabase' },
        { file: 'src/app/buildApp.ts', dropLines: 'database.close()' },
        { file: 'src/app/buildApp.ts', replace: '{ databasePath, logLevel }', with: '{ logLevel }' },
        { file: 'src/app/buildApp.test.ts', replace: "databasePath: ':memory:', ", with: '', all: true },
        { file: 'src/app/AppTypes.ts', replace: "'databasePath' | 'logLevel'", with: "'logLevel'" },
        { file: 'src/shared/EnvTypes.ts', dropLines: 'databasePath' },
        { file: 'src/shared/lib/readEnv.ts', dropLines: 'DATABASE_PATH: z' },
        { file: 'src/shared/lib/readEnv.ts', replace: ', databasePath: env.DATABASE_PATH', with: '' },
        { file: 'src/shared/lib/readEnv.test.ts', replace: ", databasePath: 'todos.db'", with: '' },
        { file: 'src/shared/lib/readEnv.test.ts', replace: " DATABASE_PATH: ':memory:',", with: '' },
        { file: 'src/shared/lib/readEnv.test.ts', dropLines: "databasePath: ':memory:'" },
        { file: 'README.md', dropLines: '| `DATABASE_PATH` |' },
        { file: 'README.md', replace: 'wires everything: database, ', with: 'wires everything: ' },
        { file: 'README.md', replace: 'env, database connection, server factory', with: 'env, server factory' },
        { file: 'docs/verifications.md', replace: 'it holds three plain modules', with: 'it holds two plain modules' },
      ],
    },
    {
      when: { 'claude-hook': false },
      remove: ['.claude'],
      edits: [
        { file: 'knip.json', replace: '"@brutal/agent-hook", ', with: '' },
        { file: 'README.md', dropSection: '## Working with an agent' },
      ],
      dependencies: ['@brutal/agent-hook'],
    },
    {
      when: { ci: false },
      remove: ['.github'],
      edits: [{ file: 'docs/verifications.md', replace: 'runs locally, in the pre-commit hook and in CI.', with: 'runs locally and in the pre-commit hook.' }],
    },
  ],
  nextSteps: () => ['npm run dev'],
};
