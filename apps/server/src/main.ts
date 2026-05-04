import Fastify from 'fastify';
import cors from '@fastify/cors';

import { lockerRoutes } from '@/modules/lockers/routes.js';
import { expanderRoutes } from '@/modules/expanders/routes.js';

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: true,
});
fastify.register(lockerRoutes);
fastify.register(expanderRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log(
      '🚚 InPost Expander Server is running on http://localhost:3000'
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
