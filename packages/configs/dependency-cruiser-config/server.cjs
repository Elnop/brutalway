module.exports = {
  extends: require.resolve('./layers.cjs'),
  forbidden: [
    {
      name: 'routes-not-to-queries',
      severity: 'error',
      comment: 'A route never runs a query: it calls its service, which calls the queries.',
      from: { path: 'Routes\\.ts$' },
      to: { path: 'Queries\\.ts$' },
    },
    {
      name: 'queries-behind-services',
      severity: 'error',
      comment: 'Queries are only used by a service, a worker, other queries or by src/app/ to wire them: call the service instead.',
      from: { pathNot: ['Service\\.ts$', 'Worker\\.ts$', 'Queries\\.ts$', '^src/app/', '\\.test\\.ts$'] },
      to: { path: 'Queries\\.ts$' },
    },
    {
      name: 'database-in-queries',
      severity: 'error',
      comment: 'Only an xQueries.ts file talks to the database driver (src/shared/ opens the connection): move this SQL into the queries of its shared feature.',
      from: { pathNot: ['Queries\\.ts$', '^src/shared/'] },
      to: { path: ['^(node:)?sqlite$', 'node_modules/(pg|postgres|mysql2|better-sqlite3)/'] },
    },
    {
      name: 'workers-started-from-app',
      severity: 'error',
      comment: 'A worker is started and stopped by src/app/ with the server: start it there, not from a route or a service.',
      from: { pathNot: ['^src/app/', '\\.test\\.ts$'] },
      to: { path: 'Worker\\.ts$' },
    },
    {
      name: 'http-in-clients',
      severity: 'error',
      comment: 'Only an xClient.ts file calls another HTTP API: move this call into the client of that API.',
      from: { pathNot: ['Client\\.ts$', '\\.test\\.ts$'] },
      to: { path: ['^(node:)?https?$', 'node_modules/(undici|axios|got|node-fetch)/'] },
    },
  ],
};
