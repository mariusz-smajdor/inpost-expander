import Fastify from 'fastify';
import cors from '@fastify/cors';

import { lockerRoutes } from '@/modules/lockers/routes.js';
import { expanderRoutes } from '@/modules/expanders/routes.js';

const fastify = Fastify({
  // For convenience in this recruitment project, I set origin to true.
  // In a production scenario, I would use an environment variable (e.g., process.env.ALLOWED_ORIGINS)
  // to whitelist specific URLs and toggle them based on whether the project runs in Dev or Prod mode.
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
