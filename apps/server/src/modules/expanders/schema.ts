import type { FastifySchema } from 'fastify';

export const expandersSchema: { schema: FastifySchema } = {
  schema: {
    querystring: {
      type: 'object',
      required: ['west', 'south', 'east', 'north'],
      properties: {
        west: { type: 'number' },
        south: { type: 'number' },
        east: { type: 'number' },
        north: { type: 'number' },
      },
    },
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            longitude: { type: 'number' },
            latitude: { type: 'number' },
            type: { type: 'string' },
            distanceToNearest: { type: 'number' },
            buildingDensity: { type: 'number' },
            score: { type: 'number' },
          },
        },
      },
    },
  },
};
