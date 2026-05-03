import Fastify from 'fastify';

const fastify = Fastify({
  logger: true,
});

try {
  await fastify.listen({ port: 3000 });
  console.log('🚚 InPost Expander Server is running on http://localhost:3000');
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
