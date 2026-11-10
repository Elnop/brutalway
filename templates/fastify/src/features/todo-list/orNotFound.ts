import type { FastifyReply } from 'fastify';

const NOT_FOUND = { message: 'No todo has this id' };

export function orNotFound<T>(found: T | null, reply: FastifyReply): T | typeof NOT_FOUND {
  if (found !== null) return found;
  reply.code(404);
  return NOT_FOUND;
}
