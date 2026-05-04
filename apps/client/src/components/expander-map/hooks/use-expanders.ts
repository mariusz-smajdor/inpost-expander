import { useState, useCallback } from 'react';
import axios from 'axios';
import type { Expander } from '@inpost-expander/types';

export function useExpanders() {
  const [expanders, setExpanders] = useState<Expander[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchExpanders = useCallback(async (map: maplibregl.Map) => {
    const bounds = map.getBounds();

    setExpanders([]);
    setLoading(true);

    try {
      const { data } = await axios.get<Expander[]>(
        'http://localhost:3000/expanders',
        {
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
      console.error('Failed to fetch expanders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { expanders, fetchExpanders, loading };
}
