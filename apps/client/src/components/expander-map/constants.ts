import type { LngLatBoundsLike } from 'maplibre-gl';

export const EUROPE_MAP_BOUNDS: LngLatBoundsLike = [
  [-26, 34],
  [42, 72],
];

export const WARSAW_VIEW_STATE = {
  longitude: 21.0122,
  latitude: 52.2297,
  zoom: 10,
} as const;
