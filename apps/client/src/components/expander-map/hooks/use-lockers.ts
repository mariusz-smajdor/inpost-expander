import { useState, useCallback } from 'react';
import axios from 'axios';
import type { Locker, Cluster } from '@inpost-expander/types';

type MapResponse = Locker[] | Cluster[];

export function useLockers() {
  const [lockers, setLockers] = useState<MapResponse>([]);

  const fetchLockers = useCallback(async (map: maplibregl.Map) => {
    const bounds = map.getBounds();

    try {
      const { data } = await axios.get<MapResponse>(
        `http://localhost:3000/lockers`,
        {
          params: {
            west: bounds.getWest(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            north: bounds.getNorth(),
          },
        }
      );
      setLockers(data);
    } catch (error) {
      console.error('Failed to fetch lockers:', error);
    }
  }, []);

  return { lockers, fetchLockers };
}
