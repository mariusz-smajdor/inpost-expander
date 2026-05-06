import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import type { Locker, Cluster } from '@inpost-expander/types';

type MapResponse = Locker[] | Cluster[];

export function useLockers() {
  const [lockers, setLockers] = useState<MapResponse>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchLockers = useCallback(async (map: maplibregl.Map) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const bounds = map.getBounds();

    try {
      const { data } = await axios.get<MapResponse>(
        `http://localhost:3000/lockers`,
        {
          signal: controller.signal,
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
      if (axios.isCancel(error)) {
        console.log('Locker fetch cancelled (new request started)');
      } else {
        console.error('Failed to fetch lockers:', error);
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  return { lockers, fetchLockers };
}
