import type { LngLatBoundsLike } from 'maplibre-gl';

export const WARSAW_VIEW_STATE = {
  longitude: 21.0122,
  latitude: 52.2297,
  zoom: 12,
} as const;

export const COUNTRY_MAP_ZOOM = 6 as const;

export const EUROPE_MAP_BOUNDS: LngLatBoundsLike = [
  [-26, 34],
  [42, 72],
];
