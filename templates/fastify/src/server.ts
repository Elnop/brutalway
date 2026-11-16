import { buildApp } from '#src/app/buildApp.ts';
import { readEnv } from '#src/shared/env/readEnv.ts';

const env = readEnv();
const app = await buildApp(env);
await app.listen({ host: env.host, port: env.port });
