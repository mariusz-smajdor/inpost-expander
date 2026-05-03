import type { FastifyReply, FastifyRequest } from 'fastify';
import { lockersRepository } from './repository.js';

export const getLockersHandler = async (
  request: FastifyRequest<{
    Querystring: {
      west: number;
      south: number;
      east: number;
      north: number;
      forcePoints?: boolean;
    };
  }>,
  reply: FastifyReply
) => {
  const { west, south, east, north, forcePoints } = request.query;
  const diff = Math.abs(east - west);

  try {
    if (diff > 0.3 && !forcePoints) {
      const clusters = await lockersRepository.getClusters(
        west,
        south,
        east,
        north,
        diff
      );
      return clusters;
    }

    const lockers = await lockersRepository.getPoints(west, south, east, north);
    return lockers;
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Database error' });
  }
};
