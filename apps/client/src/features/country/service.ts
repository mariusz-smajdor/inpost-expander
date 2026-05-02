import { INPOST_COUNTRIES } from './constants';
import type { Country } from './types';

export async function fetchCountrues(): Promise<Country[]> {
  const response = await fetch('https://restcountries.com/v3.1/region/europe');

  if (!response.ok) throw new Error('Failed to fetch countries');

  const countries: Country[] = await response.json();
  const inpostCountryCodes = new Set(INPOST_COUNTRIES.map((c) => c.code));

  return countries.filter((country) => inpostCountryCodes.has(country.cca2));
}
