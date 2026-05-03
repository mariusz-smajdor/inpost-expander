export const lockersSchema = {
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
};
