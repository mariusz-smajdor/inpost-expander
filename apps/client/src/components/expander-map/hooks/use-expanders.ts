import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import type { Expander } from '@inpost-expander/types';

export function useExpanders() {
  const [expanders, setExpanders] = useState<Expander[]>([]);
  const [loading, setLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchExpanders = useCallback(async (map: maplibregl.Map) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const bounds = map.getBounds();

    setExpanders([]);
    setLoading(true);

    try {
      const { data } = await axios.get<Expander[]>(
        'http://localhost:3000/expanders',
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

      setExpanders(data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Expander fetch cancelled - map moved again');
      } else {
        console.error('Failed to fetch expanders:', error);
      }
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
        abortControllerRef.current = null;
      }
    }
  }, []);

  return { expanders, fetchExpanders, loading };
}
