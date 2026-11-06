type App = { get: (path: string, options: object, handler: (request: { query: object }) => Promise<unknown>) => void };

export function statsRoutes(app: App) {
  app.get('/stats', { schema: {} }, async (request) => request.query);
}
