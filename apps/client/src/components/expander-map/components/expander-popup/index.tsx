import { Popup } from 'react-map-gl/maplibre';
import { MapPin, Building2 } from 'lucide-react';
import type { Expander } from '@inpost-expander/types';
import 'maplibre-gl/dist/maplibre-gl.css';

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import '../../styles.css';
import { checkLocationInStreetView } from '@/utils/streetview';

interface ExpanderPopupProps {
  expander: Expander;
  onPopupClose: () => void;
}

export default function ExpanderPopup({
  expander,
  onPopupClose,
}: ExpanderPopupProps) {
  const { score, buildingDensity, distanceToNearest, latitude, longitude } =
    expander;

  const calculatePercentage = (s: number) => {
    const maxScore = 8000;
    const p = Math.round((s / maxScore) * 100);
    return Math.min(p, 100);
  };

  const percentage = calculatePercentage(score);

  const getRankInfo = (p: number) => {
    if (p >= 70)
      return {
        label: 'High Potential',
        variant: 'secondary' as const,
        msg: 'Great location for a new machine',
        bg: 'bg-secondary',
      };
    if (p >= 30)
      return {
        label: 'Standard',
        variant: 'default' as const,
        msg: 'A solid point complementing the network',
        bg: 'bg-primary',
      };
    return {
      label: 'Developmental',
      variant: 'outline' as const,
      msg: 'Needs further analysis of surroundings',
      bg: 'bg-destructive',
    };
  };
  const rank = getRankInfo(percentage);

  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      onClose={onPopupClose}
      className='custom-popup'
    >
      <Card className='bg-background/25 w-xs rounded-lg backdrop-blur-md'>
        <CardHeader>
          <CardAction>
            <Badge
              variant={rank.variant}
              className='rounded-full font-mono text-[10px]'
            >
              {rank.label}
            </Badge>
          </CardAction>
          <CardTitle className='flex flex-col font-mono leading-tight tracking-tighter'>
            <span className='text-primary text-lg font-black uppercase'>
              Suggested Point
            </span>
            <span className='text-muted-foreground text-[10px] font-bold uppercase'>
              {rank.msg}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className='mt-4 flex w-full flex-col gap-3'>
          <div className='flex gap-2 text-xs font-medium'>
            <Building2 className='text-primary h-4 w-4 shrink-0' />
            <span>
              Gęstość: <strong>{buildingDensity}</strong> budynków / 300m
            </span>
          </div>

          <div className='flex gap-2 text-xs font-medium'>
            <MapPin className='text-primary h-4 w-4 shrink-0' />
            <span>
              Konkurencja: <strong>{Math.round(distanceToNearest)}m</strong> do
              bazy
            </span>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-xs font-bold'>
                Rekomendacja ekspansji
              </span>
              <span className='text-primary font-mono text-sm'>
                {percentage}%
              </span>
            </div>
            <Progress value={percentage} />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className='w-full rounded'
            onClick={() => checkLocationInStreetView(latitude, longitude)}
          >
            Check in Street View
          </Button>
        </CardFooter>
      </Card>
    </Popup>
  );
}
