import { useRef, useEffect, useCallback } from 'react';
import { Map, type MapRef } from 'react-map-gl/maplibre';

import Header from '@/components/header';
import { useCountry } from '@/features/country/provider';
import {
  EUROPE_MAP_BOUNDS,
  COUNTRY_MAP_ZOOM,
  WARSAW_VIEW_STATE,
} from './constants';
import { useLockers } from './hooks/use-lockers';
import LockerMarker from './components/locker-marker';

export default function ExpanderMap() {
  const mapRef = useRef<MapRef | null>(null);

  const { country } = useCountry();
  const { lockers, fetchLockers } = useLockers();

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.resize();
    }
  }, []);

  useEffect(() => {
    if (country && mapRef.current) {
      mapRef.current.flyTo({
        center: [country.latlng[1], country.latlng[0]],
        zoom: COUNTRY_MAP_ZOOM,
        essential: true,
      });
    }
  }, [country]);

  const fetchMapData = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    fetchLockers(map);
  }, [fetchLockers]);

  return (
    <>
      <Header />
      <Map
        ref={mapRef}
        initialViewState={WARSAW_VIEW_STATE}
        maxBounds={EUROPE_MAP_BOUNDS}
        mapStyle='https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
        onLoad={fetchMapData}
        onMoveEnd={fetchMapData}
      >
        {lockers.map((locker) => (
          <LockerMarker key={locker.id} locker={locker} />
        ))}
      </Map>
    </>
  );
}
