import { Popup } from 'react-map-gl/maplibre';
import type { Locker } from '@inpost-expander/types';
import { MapPin } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { POPUP_OFFSETS } from './constants';
import './styles.css';

interface LockerPopupProps {
  locker: Locker;
  onPopupClose: () => void;
}

export default function LockerPopup({
  locker,
  onPopupClose,
}: LockerPopupProps) {
  const checkLockerInStreetView = () => {
    const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${locker.latitude},${locker.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <Popup
      longitude={locker.longitude}
      latitude={locker.latitude}
      onClose={onPopupClose}
      offset={POPUP_OFFSETS}
      className='custom-popup'
    >
      <Card className='bg-background/25 relative mx-auto w-full max-w-md rounded-lg pt-0 backdrop-blur-md'>
        <div className='absolute inset-0 z-30 aspect-video' />
        <img
          src={locker.imageUrl!}
          alt={locker.id}
          className='relative z-20 aspect-video w-full object-cover'
        />
        <CardHeader>
          <CardAction>
            <Badge
              variant={
                locker.status === 'Operating'
                  ? 'secondary'
                  : locker.status === 'Created'
                    ? 'default'
                    : 'destructive'
              }
              className='rounded-full font-mono text-[10px]'
            >
              {locker.status}
            </Badge>
          </CardAction>
          <CardTitle className='flex flex-col font-mono leading-0'>
            <span className='text-primary text-lg font-black uppercase'>
              {locker.id}
            </span>
            <span className='text-muted-foreground text-[10px] font-bold uppercase'>
              {locker.pointType === 'locker' ? 'Locker' : 'Pickup Point'}
            </span>
          </CardTitle>

          <CardDescription className='mt-4 flex gap-2 text-xs font-medium'>
            <MapPin className='text-primary mt-0.5 h-4 w-4 shrink-0' />
            <span>
              {locker.street} {locker.buildingNumber}, {locker.city}{' '}
              {locker.postCode}
            </span>
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className='w-full rounded' onClick={checkLockerInStreetView}>
            Check in Street View
          </Button>
        </CardFooter>
      </Card>
    </Popup>
  );
}
