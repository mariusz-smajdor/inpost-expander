import { useState, useContext, createContext, type ReactNode } from 'react';

import type { Country } from './types';

type CountryContextType = {
  country: Country | null;
  setCountry: (country: Country | null) => void;
};

const CountryContext = createContext<CountryContextType | null>(null);

export function CountryProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState<Country | null>(null);

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);

  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }

  return context;
}
