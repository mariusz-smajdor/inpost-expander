import type { FastifyReply, FastifyRequest } from 'fastify';
import axios from 'axios';

import { expandersRepository } from './repository.js';
import type { BuildingLocation, OSMElement } from '@/types/osm-api.js';

export const getExpanderSuggestionsHandler = async (
  request: FastifyRequest<{
    Querystring: { west: number; south: number; east: number; north: number };
  }>,
  reply: FastifyReply
) => {
  const { west, south, east, north } = request.query;

  try {
    const osmQuery = await expandersRepository.getOsmQuery(
      west,
      south,
      east,
      north
    );

    const params = new URLSearchParams();
    params.append('data', osmQuery);

    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      params,
      {
        headers: {
          'User-Agent': 'InPost-Expander-App/1.0',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const osmData = response.data;

    const buildings: BuildingLocation[] = osmData.elements.map(
      (el: OSMElement) => {
        const lat = el.center?.lat ?? el.lat;
        const lon = el.center?.lon ?? el.lon;

        if (lat === undefined || lon === undefined) {
          throw new Error(`Element OSM ${el.id} nie posiada współrzędnych`);
        }

        return {
          lat,
          lon,
        };
      }
    );

    await expandersRepository.saveBuildings(buildings);
    const suggestions = await expandersRepository.getExpanders(
      west,
      south,
      east,
      north
    );

    return suggestions;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      request.log.error(error.response?.data || error.message);
    } else {
      request.log.error(error);
    }

    return reply.status(500).send({ error: 'BI Engine Error' });
  }
};
