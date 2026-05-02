import { useRef, useEffect } from 'react';
import { Map, type MapRef } from 'react-map-gl/maplibre';

import Header from '@/components/header';
import { useCountry } from '@/features/country/provider';
import {
  EUROPE_MAP_BOUNDS,
  COUNTRY_MAP_ZOOM,
  WARSAW_VIEW_STATE,
} from './constants';

export default function ExpanderMap() {
  const mapRef = useRef<MapRef | null>(null);
  const { country } = useCountry();

  useEffect(() => {
    if (country && mapRef.current) {
      mapRef.current.flyTo({
        center: [country.latlng[1], country.latlng[0]],
        zoom: COUNTRY_MAP_ZOOM,
        essential: true,
      });
    }
  }, [country]);

  return (
    <>
      <Header />
      <Map
        ref={mapRef}
        initialViewState={WARSAW_VIEW_STATE}
        maxBounds={EUROPE_MAP_BOUNDS}
        mapStyle='https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      ></Map>
    </>
  );
}
