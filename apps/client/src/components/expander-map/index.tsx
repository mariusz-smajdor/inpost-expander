import { useState, useRef, useEffect, useCallback } from 'react';
import { Map, type MapRef } from 'react-map-gl/maplibre';
import type { Cluster, Locker } from '@inpost-expander/types';

import { useCountry } from '@/features/country/use-country';

import Header from '@/components/header';
import LockerMarker from './components/locker-marker';
import LockerPopup from './components/locker-popup';
import ExpanderMarker from './components/expander-marker';
import ExpandersButton from './components/expanders-button';
import { useLockers } from './hooks/use-lockers';
import { useExpanders } from './hooks/use-expanders';
import {
  EUROPE_MAP_BOUNDS,
  COUNTRY_MAP_ZOOM,
  WARSAW_VIEW_STATE,
} from './constants';

export default function ExpanderMap() {
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const mapRef = useRef<MapRef | null>(null);

  const { country } = useCountry();
  const { lockers, fetchLockers } = useLockers();
  const { expanders, fetchExpanders, loading } = useExpanders();

  const isPoint = lockers[0]?.type === 'point';

  useEffect(() => {
    if (country && mapRef.current) {
      mapRef.current.flyTo({
        center: [country.latlng[1], country.latlng[0]],
        zoom: COUNTRY_MAP_ZOOM,
        essential: true,
      });
    }
  }, [country]);

  const handleClusterClick = useCallback(
    (cluster: Cluster) => {
      if (!mapRef.current) return;

      if (cluster.west && cluster.south && cluster.east && cluster.north) {
        mapRef.current.fitBounds(
          [
            [cluster.west, cluster.south],
            [cluster.east, cluster.north],
          ],
          { padding: 100, duration: 1000, essential: true }
        );
      }
    },
    [mapRef]
  );

  const handleFindExpanders = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    fetchExpanders(map);
  }, [fetchExpanders]);

  const handleFetchLockers = useCallback(() => {
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
        attributionControl={false}
        onLoad={handleFetchLockers}
        onMoveEnd={handleFetchLockers}
      >
        {lockers.map((item) => (
          <LockerMarker
            key={item.id}
            marker={item}
            onClusterClick={handleClusterClick}
            onLockerClick={(locker) => setSelectedLocker(locker)}
          />
        ))}
        {selectedLocker ? (
          <LockerPopup
            locker={selectedLocker}
            onPopupClose={() => setSelectedLocker(null)}
          />
        ) : null}

        {expanders.map((expander) => (
          <ExpanderMarker
            key={String(expander.latitude) + String(expander.longitude)}
            expander={expander}
          />
        ))}
      </Map>
      {isPoint ? (
        <ExpandersButton
          loading={loading}
          handleFindExpanders={handleFindExpanders}
        />
      ) : null}
    </>
  );
}
