import { useState, type ReactNode } from 'react';

import { CountryContext } from './country-context';
import type { Country } from './types';

export function CountryProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState<Country | null>(null);

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
}
