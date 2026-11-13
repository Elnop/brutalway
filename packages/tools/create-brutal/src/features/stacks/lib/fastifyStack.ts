import type { Stack } from '#src/shared-features/stack/StackTypes.ts';
import { TEMPLATE_ONLY_DOCS } from '#src/features/stacks/configs/templateDocsConfig.ts';

const NPM_TEST_ROW = '`node:test`: queries on an in-memory database, routes through `inject()`';
const ROW_ID_SENTENCE =
  " That is also why `src/shared-features/todos/todosQueries.ts` reads `row['id']`.";
const TEST_FILES_OPENING_A_DATABASE = [
  'src/shared-features/todos/todosQueries.test.ts',
  'src/features/todo-list/todoListRoutes.test.ts',
  'src/features/todo-stats/todoStatsRoutes.test.ts',
];

const TODO_LIST_ROUTES_TEST = 'src/features/todo-list/todoListRoutes.test.ts';
const TODO_STATS_ROUTES_TEST = 'src/features/todo-stats/todoStatsRoutes.test.ts';
const HTTP_SERVER = 'src/features/http-server/createHttpServer.ts';
const SERVICES = [
  'src/features/todo-list/todoListService.ts',
  'src/features/todo-stats/todoStatsService.ts',
];
const EMPTY_MEMORY_STORE =
  '  const todos = createTodosQueries();\n  for (const todo of todos.list()) todos.remove(todo.id);\n';
const DATABASE_DRIVER_SENTENCES = [
  'docs/concepts/architecture.md',
  'docs/reference/verifications.md',
].map((file) => ({
  file,
  replace: 'queries, `src/features/database/` and the tests',
  with: 'queries and the tests',
}));

export const fastifyStack: Stack = {
  id: 'fastify',
  label: 'Fastify API',
  directory: 'templates/fastify',
  options: [
    { id: 'example', message: 'Keep the todo list API example?', default: true },
    { id: 'swagger', message: 'Serve a Swagger UI on /docs?', default: true },
    {
      id: 'database',
      message: 'Use SQLite (node:sqlite)? Without it, the example keeps its todos in memory.',
      default: true,
    },
    {
      id: 'claude-hook',
      message: 'Add the Claude Code hook that lints each edited file?',
      default: true,
      independent: true,
    },
    { id: 'ci', message: 'Add the GitHub Actions workflow?', default: true, independent: true },
  ],
  changes: [
    {
      when: {},
      remove: ['CHANGELOG.md'],
      edits: [{ file: 'README.md', replace: '# template-fastify\n', with: '# __PROJECT_NAME__\n' }],
    },
    TEMPLATE_ONLY_DOCS,
    {
      when: { example: false },
      remove: [
        'src/features/todo-list',
        'src/features/todo-stats',
        'src/shared-features/todos',
        'test-utils',
        'docs/reference/endpoints.md',
      ],
      edits: [
        { file: 'src/app/buildApp.ts', dropLines: '#src/features/todo-' },
        { file: 'src/app/buildApp.ts', dropLines: 'Routes(create' },
        {
          file: 'src/app/buildApp.ts',
          replace: 'database.close());\n\n',
          with: 'database.close());\n',
        },
        {
          file: HTTP_SERVER,
          replace: "'Todos API'",
          with: "'__PROJECT_NAME__'",
          all: true,
        },
        { file: 'README.md', dropLines: 'The example is the todo list API' },
        { file: 'README.md', dropLines: 'docs/reference/endpoints.md' },
        {
          file: 'docs/reference/layout.md',
          replace:
            ' `src/shared-features/todos/` holds the schemas, the types and `todosQueries.ts`, the only file that runs SQL on the todos table. `src/features/todo-list/` and `src/features/todo-stats/` both use it without knowing each other.',
          with: '',
        },
        {
          file: 'docs/reference/commands.md',
          replace: NPM_TEST_ROW,
          with: '`node:test`, routes through `inject()`',
        },
        {
          file: 'docs/guides/start-your-own-api.md',
          dropLines: '1. Delete `src/features/todo-list/`',
        },
        {
          file: 'docs/guides/start-your-own-api.md',
          replace: '2. Add a shared feature',
          with: '1. Add a shared feature',
        },
        {
          file: 'docs/guides/start-your-own-api.md',
          replace: '3. Run `npm run check` often',
          with: '2. Run `npm run check` often',
        },
        { file: 'docs/reference/verifications.md', replace: ROW_ID_SENTENCE, with: '' },
        { file: 'docs/reference/verifications.md', dropLines: '| Queries |' },
        { file: 'docs/reference/verifications.md', dropLines: '| Routes |' },
        {
          file: 'docs/concepts/architecture.md',
          replace:
            ' A request goes `src/features/todo-list/todoListRoutes.ts` → `src/features/todo-list/todoListService.ts` → `src/shared-features/todos/todosQueries.ts`, and only queries run SQL.',
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
      edits: [
        {
          file: 'docs/reference/endpoints.md',
          replace:
            ', serialize the output and produce the OpenAPI document served on `/docs/json`.',
          with: ' and serialize the output.',
        },
      ],
    },
    {
      when: { swagger: false },
      remove: ['src/features/http-server/swaggerTheme.css'],
      edits: [
        { file: HTTP_SERVER, dropLines: 'readFileSync' },
        { file: HTTP_SERVER, dropLines: '@fastify/swagger' },
        {
          file: HTTP_SERVER,
          replace:
            "import {\n  jsonSchemaTransform,\n  serializerCompiler,\n  validatorCompiler,\n} from 'fastify-type-provider-zod';",
          with: "import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';",
        },
        { file: HTTP_SERVER, dropLines: 'jsonSchemaTransform' },
        { file: HTTP_SERVER, dropLines: 'SWAGGER_THEME' },
        { file: HTTP_SERVER, dropLines: 'server.register(swagger' },
        { file: HTTP_SERVER, dropLines: 'openapi: { info:' },
        { file: HTTP_SERVER, dropLines: "routePrefix: '/docs'" },
        { file: HTTP_SERVER, replace: '\n\n  });\n  });\n', with: '\n' },
        { file: HTTP_SERVER, replace: 'export async function', with: 'export function' },
        {
          file: 'src/app/buildApp.ts',
          replace: 'await createHttpServer(',
          with: 'createHttpServer(',
        },
        { file: 'README.md', replace: ', and the Swagger UI on `/docs`.', with: '.' },
        {
          file: 'docs/reference/layout.md',
          replace: 'the server and its Swagger UI live in',
          with: 'the server lives in',
        },
        {
          file: 'docs/reference/verifications.md',
          replace: 'the full wiring and the OpenAPI document',
          with: 'the full wiring',
        },
      ],
      removeDependencies: ['@fastify/swagger-ui'],
    },
    {
      when: { example: true, database: false },
      overlay: 'memory-store',
      edits: [
        ...TEST_FILES_OPENING_A_DATABASE.map((file) => ({
          file,
          dropLines: "import { DatabaseSync } from 'node:sqlite';",
        })),
        {
          file: 'src/shared-features/todos/todosQueries.test.ts',
          replace: "  return createTodosQueries(new DatabaseSync(':memory:'));\n",
          with: `${EMPTY_MEMORY_STORE}  return todos;\n`,
        },
        {
          file: TODO_LIST_ROUTES_TEST,
          before: "import { createTestServer } from '#test-utils/createTestServer.ts';\n",
          insert:
            "import { createTodosQueries } from '#src/shared-features/todos/todosQueries.ts';\n",
        },
        {
          file: TODO_LIST_ROUTES_TEST,
          replace: "createTodoListService(new DatabaseSync(':memory:'))",
          with: 'createTodoListService()',
        },
        {
          file: TODO_LIST_ROUTES_TEST,
          before: '  const app = createTestServer();\n',
          insert: EMPTY_MEMORY_STORE,
        },
        {
          file: TODO_STATS_ROUTES_TEST,
          replace:
            "    const database = new DatabaseSync(':memory:');\n    const todos = createTodosQueries(database);\n",
          with: '    const todos = createTodosQueries();\n',
        },
        {
          file: TODO_STATS_ROUTES_TEST,
          replace: 'createTodoStatsService(database)',
          with: 'createTodoStatsService()',
        },
        ...SERVICES.flatMap((file) => [
          {
            file,
            replace: '(database: Parameters<typeof createTodosQueries>[0])',
            with: '()',
          },
          { file, replace: 'createTodosQueries(database)', with: 'createTodosQueries()' },
        ]),
        { file: 'src/app/buildApp.ts', replace: 'Service(database)', with: 'Service()', all: true },
        {
          file: 'docs/reference/layout.md',
          replace: 'the only file that runs SQL on the todos table',
          with: 'which keeps the todos in memory',
        },
        {
          file: 'docs/reference/commands.md',
          replace: NPM_TEST_ROW,
          with: '`node:test`: queries, routes through `inject()`',
        },
        { file: 'docs/reference/verifications.md', replace: ROW_ID_SENTENCE, with: '' },
        {
          file: 'docs/reference/verifications.md',
          replace: 'the SQL, on a `:memory:` database',
          with: 'the in-memory store',
        },
      ],
    },
    {
      when: { database: false },
      remove: ['src/features/database'],
      edits: [
        { file: 'src/app/buildApp.ts', dropLines: 'openDatabase' },
        { file: 'src/app/buildApp.ts', dropLines: 'database.close()' },
        {
          file: 'src/app/buildApp.ts',
          replace: '{ databasePath, logLevel }',
          with: '{ logLevel }',
        },
        {
          file: 'src/app/buildApp.test.ts',
          replace: "databasePath: ':memory:', ",
          with: '',
          all: true,
        },
        {
          file: 'src/app/AppTypes.ts',
          replace: ' & { databasePath: string }',
          with: '',
        },
        { file: 'src/shared/EnvTypes.ts', dropLines: 'databasePath' },
        { file: 'src/shared/readEnv.ts', dropLines: 'DATABASE_PATH: z' },
        { file: 'src/shared/readEnv.ts', dropLines: 'databasePath: env.DATABASE_PATH' },
        { file: 'src/shared/readEnv.test.ts', dropLines: "databasePath: 'todos.db'" },
        {
          file: 'src/shared/readEnv.test.ts',
          replace:
            "    assert.deepEqual(\n      readEnv({ HOST: '0.0.0.0', PORT: '8080', DATABASE_PATH: ':memory:', LOG_LEVEL: 'silent' }),\n      {\n        host: '0.0.0.0',\n        port: 8080,\n        databasePath: ':memory:',\n        logLevel: 'silent',\n      },\n    );\n",
          with: "    assert.deepEqual(readEnv({ HOST: '0.0.0.0', PORT: '8080', LOG_LEVEL: 'silent' }), {\n      host: '0.0.0.0',\n      port: 8080,\n      logLevel: 'silent',\n    });\n",
        },
        { file: 'README.md', dropLines: '| `DATABASE_PATH` |' },
        {
          file: 'docs/reference/layout.md',
          replace: 'composes the features: server, database, routes',
          with: 'composes the features: server, routes',
        },
        {
          file: 'docs/reference/layout.md',
          replace: ', the connection in `src/features/database/`.',
          with: '.',
        },
        {
          file: 'docs/reference/layout.md',
          replace:
            ' (`createTodoListService(database)`) and build their queries from them, and `src/app/buildApp.ts` is the one place that opens the database and passes it.',
          with: ' and build their queries with `createTodosQueries()`.',
        },
        {
          file: 'docs/concepts/architecture.md',
          replace: '(`createTodoListService(database)`)',
          with: '(`createTodoListService()`)',
        },
        {
          file: 'docs/concepts/architecture.md',
          replace: 'builds its own queries from the database it gets.',
          with: 'builds its own queries.',
        },
        {
          file: 'docs/concepts/architecture.md',
          replace: 'A test builds the service on a `:memory:` database and nothing else.',
          with: 'A test builds the service and nothing else.',
        },
        ...DATABASE_DRIVER_SENTENCES,
      ],
    },
    {
      when: { 'claude-hook': false },
      remove: ['.claude', 'docs/guides/work-with-an-agent.md'],
      edits: [
        { file: 'knip.json', replace: '    "@brutalway/agent-hook",\n', with: '' },
        { file: 'README.md', dropLines: 'docs/guides/work-with-an-agent.md' },
      ],
      removeDependencies: ['@brutalway/agent-hook'],
    },
    {
      when: { ci: false },
      remove: ['.github'],
      edits: [
        {
          file: 'docs/reference/verifications.md',
          replace: 'runs locally, in the pre-commit hook and in CI.',
          with: 'runs locally and in the pre-commit hook.',
        },
      ],
    },
  ],
  nextSteps: () => ['npm run dev'],
};
