import { Marker, type MarkerEvent } from 'react-map-gl/maplibre';
import type { Cluster, Locker } from '@inpost-expander/types';
import 'maplibre-gl/dist/maplibre-gl.css';

import { cn } from '@/lib/utils';

interface LockerMarkerProps {
  marker: Locker | Cluster;
  onClusterClick: (cluster: Cluster) => void;
  onLockerClick: (locker: Locker) => void;
}

export default function LockerMarker({
  marker,
  onClusterClick,
  onLockerClick,
}: LockerMarkerProps) {
  const isCluster = marker.type === 'cluster';
  const count = isCluster ? (marker as Cluster).count : 0;

  const onMarkerClick = (e: MarkerEvent<MouseEvent>) => {
    e.originalEvent.stopPropagation();
    if (isCluster) {
      onClusterClick(marker);
    } else {
      onLockerClick(marker);
    }
  };

  return (
    <Marker
      longitude={marker.longitude}
      latitude={marker.latitude}
      anchor={isCluster ? 'center' : 'bottom'}
      onClick={onMarkerClick}
    >
      {isCluster ? (
        <div
          className={cn(
            'bg-background/25 border-primary flex items-center justify-center rounded-full border font-mono backdrop-blur-md transition-all hover:scale-110',
            count < 10 ? 'h-10 w-10' : count < 50 ? 'h-12 w-12' : 'h-14 w-14'
          )}
        >
          {marker.count}
        </div>
      ) : (
        <img
          src={
            marker.pointType === 'locker'
              ? '/pin-paczkomat.png'
              : '/pin-punkt.png'
          }
          alt='pin'
          className='h-10 transition-transform hover:scale-110'
        />
      )}
    </Marker>
  );
}
