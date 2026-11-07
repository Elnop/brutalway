import { buildApp } from '#src/app/buildApp.ts';
import { readEnv } from '#src/shared/lib/readEnv.ts';

const env = readEnv();
const app = await buildApp(env);
await app.listen({ host: env.host, port: env.port });
