import { FEATURES } from '#src/app/AppConfig.ts';
import type { BuildAppOptions } from '#src/app/AppTypes.ts';
import { openDatabase } from '#src/features/database/openDatabase.ts';
import { createHttpServer } from '#src/features/http-server/createHttpServer.ts';

export async function buildApp({ databasePath, logLevel }: BuildAppOptions) {
  const app = await createHttpServer({ logLevel });
  const database = openDatabase(databasePath);
  app.addHook('onClose', async () => database.close());

  for (const routes of FEATURES) await app.register(routes(database));
  return app;
}
