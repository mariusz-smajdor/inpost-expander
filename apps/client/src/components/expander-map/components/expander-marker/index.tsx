import { Marker } from 'react-map-gl/maplibre';
import type { Expander } from '@inpost-expander/types';

interface ExpanderMarkerProps {
  expander: Expander;
}

export default function ExpanderMarker({ expander }: ExpanderMarkerProps) {
  return (
    <Marker
      longitude={expander.longitude}
      latitude={expander.latitude}
      anchor='center'
    >
      <div className='relative flex items-center justify-center'>
        <div className='bg-primary/25 absolute inline-flex h-5 w-5 animate-ping rounded-full'></div>
        <div className='bg-primary border-primary/50 relative inline-flex h-3 w-3 rounded-full border-2 shadow-sm'></div>
      </div>
    </Marker>
  );
}
