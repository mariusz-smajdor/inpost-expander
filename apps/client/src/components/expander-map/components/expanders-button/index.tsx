import { Info, LocateFixed } from 'lucide-react';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface ExpandersButtonProps {
  loading: boolean;
  handleFindExpanders: () => void;
}

export default function ExpandersButton({
  loading,
  handleFindExpanders,
}: ExpandersButtonProps) {
  return (
    <HoverCard openDelay={10} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          type='button'
          disabled={loading}
          onClick={handleFindExpanders}
          className='bg-background/25 border-primary hover:bg-primary/10 absolute right-10 bottom-10 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 backdrop-blur-md duration-300 disabled:cursor-not-allowed disabled:opacity-50'
        >
          <LocateFixed className='text-primary' size={22} />
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        sideOffset={10}
        className='bg-background/25 backdrop-blur-md'
      >
        {loading ? (
          <p className='text-sm'>Finding expanders...</p>
        ) : (
          <>
            <p className='text-sm'>
              Click to find suggested expander locations based on visible
              lockers and population density.
            </p>
            <div className='mt-2 flex gap-2 leading-0'>
              <Info size={16} className='text-primary' />
              <span className='text-muted-foreground text-xs'>
                Zoom in for more precise suggestions.
              </span>
            </div>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
