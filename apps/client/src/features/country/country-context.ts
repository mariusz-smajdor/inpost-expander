import { createContext } from 'react';

import type { Country } from './types';

export type CountryContextType = {
  country: Country | null;
  setCountry: (country: Country | null) => void;
};

export const CountryContext = createContext<CountryContextType | null>(null);
