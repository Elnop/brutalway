import { readFileSync } from 'node:fs';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import type { Env } from '#src/shared/EnvTypes.ts';

const SWAGGER_THEME = readFileSync(new URL('swaggerTheme.css', import.meta.url), 'utf8');

export async function createHttpServer({ logLevel }: Pick<Env, 'logLevel'>) {
  const server = Fastify({ logger: { level: logLevel } }).withTypeProvider<ZodTypeProvider>();
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  await server.register(swagger, {
    openapi: { info: { title: 'Todos API', version: '1.0.0' } },
    transform: jsonSchemaTransform,
  });
  await server.register(swaggerUi, {
    routePrefix: '/docs',
    theme: { title: 'Todos API', css: [{ filename: 'theme.css', content: SWAGGER_THEME }] },
  });
  return server;
}
