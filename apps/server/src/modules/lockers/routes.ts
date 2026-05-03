import type { FastifyInstance } from 'fastify';

import { getLockersHandler } from './controller.js';
import { lockersSchema } from './schema.js';

export async function lockerRoutes(fastify: FastifyInstance) {
  fastify.get('/lockers', { schema: lockersSchema }, getLockersHandler);
}
