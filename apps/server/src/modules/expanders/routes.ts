import type { FastifyInstance } from 'fastify';

import { getExpanderSuggestionsHandler } from './controller.js';
import { expandersSchema } from './schema.js';

export async function expanderRoutes(fastify: FastifyInstance) {
  fastify.get('/expanders', expandersSchema, getExpanderSuggestionsHandler);
}
