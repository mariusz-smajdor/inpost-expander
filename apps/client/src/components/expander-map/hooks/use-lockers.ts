import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import type { Locker, Cluster } from '@inpost-expander/types';

type MapResponse = Locker[] | Cluster[];

export function useLockers() {
  const [lockers, setLockers] = useState<MapResponse>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const fetchLockers = useCallback(
    async (map: maplibregl.Map) => {
      cleanup();

      const executeFetch = async () => {
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
          if (!axios.isCancel(error)) {
            console.error('Failed to fetch lockers:', error);
          }
        } finally {
          if (abortControllerRef.current === controller) {
            abortControllerRef.current = null;
          }
        }
      };

      if (lockers.length === 0) {
        await executeFetch();
      } else {
        debounceTimerRef.current = setTimeout(executeFetch, 300);
      }
    },
    [cleanup, lockers.length]
  );

  return { lockers, fetchLockers };
}
