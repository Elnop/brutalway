type Reply = { send: (value: unknown) => void };
type App = { decorate: (name: string, value: unknown) => void; get: (path: string, handler: (request: unknown, reply: Reply) => Promise<unknown>) => void };

export function listRoutes(app: App) {
  app.decorate('db', {});
  app.get('/todos', async (_request, reply) => {
    reply.send([]);
    return [];
  });
  app.get('/stats', async () => ({ remaining: 0 }));
}
