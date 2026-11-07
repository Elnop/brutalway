import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import type { Env } from '#src/shared/EnvTypes.ts';

export function createServer({ logLevel }: Pick<Env, 'logLevel'>) {
  const server = Fastify({ logger: { level: logLevel } }).withTypeProvider<ZodTypeProvider>();
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);
  return server;
}
