import type { FastifyInstance } from 'fastify';

import { getExpanderSuggestionsHandler } from './controller.js';

export async function expanderRoutes(fastify: FastifyInstance) {
  fastify.get('/expanders', getExpanderSuggestionsHandler);
}
