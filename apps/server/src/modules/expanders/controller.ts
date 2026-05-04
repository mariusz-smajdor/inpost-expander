import axios from 'axios';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { expandersRepository } from './repository.js';

export const getExpanderSuggestionsHandler = async (
  request: FastifyRequest<{
    Querystring: { west: number; south: number; east: number; north: number };
  }>,
  reply: FastifyReply
) => {
  const { west, south, east, north } = request.query;

  try {
    // 1. Generujemy zapytanie
    const osmQuery = await expandersRepository.getOsmQuery(
      west,
      south,
      east,
      north
    );

    // 2. Przygotowujemy parametry (format x-www-form-urlencoded)
    const params = new URLSearchParams();
    params.append('data', osmQuery);

    // 3. Wywołanie Axios
    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      params,
      {
        headers: {
          'User-Agent': 'InPost-Expander-App/1.0',
          // Axios sam ustawi Content-Type na 'application/x-www-form-urlencoded'
          // przy przekazaniu URLSearchParams, ale dla pewności możemy go zostawić:
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Axios przechowuje przeliczony JSON w polu .data
    const osmData = response.data;

    const buildings = osmData.elements.map((el: any) => ({
      lat: el.center?.lat || el.lat,
      lon: el.center?.lon || el.lon,
    }));

    // 4. Zapis do bazy i pobranie sugestii
    await expandersRepository.saveBuildings(buildings);
    const suggestions = await expandersRepository.getExpanders(
      west,
      south,
      east,
      north
    );

    return suggestions;
  } catch (error) {
    // Axios ma bardzo szczegółowe błędy (np. error.response.data)
    if (axios.isAxiosError(error)) {
      request.log.error(error.response?.data || error.message);
    } else {
      request.log.error(error);
    }

    return reply.status(500).send({ error: 'BI Engine Error' });
  }
};
