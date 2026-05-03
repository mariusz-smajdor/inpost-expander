import { Marker } from 'react-map-gl/maplibre';
import type { Cluster, Locker } from '@inpost-expander/types';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '@/lib/utils';

interface LockerMarkerProps {
  locker: Locker | Cluster;
}

export default function LockerMarker({ locker }: LockerMarkerProps) {
  const isCluster = locker.type === 'cluster';
  const count = isCluster ? (locker as Cluster).count : 0;

  return (
    <Marker
      longitude={locker.longitude}
      latitude={locker.latitude}
      anchor={isCluster ? 'center' : 'bottom'}
    >
      {isCluster ? (
        <div
          className={cn(
            'bg-background/25 border-primary flex items-center justify-center rounded-full border font-mono backdrop-blur-md transition-all hover:scale-110',
            count < 10 ? 'h-10 w-10' : count < 50 ? 'h-12 w-12' : 'h-14 w-14'
          )}
        >
          {locker.count}
        </div>
      ) : (
        <img
          src={
            locker.pointType === 'locker'
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
