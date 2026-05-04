import { useState, useEffect } from 'react';

import { useCountry } from '@/features/country/use-country';
import { fetchCountrues } from '@/features/country/service';
import type { Country, CountryCode } from '@/features/country/types';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Header() {
  const [countries, setCountries] = useState<Country[] | null>(null);

  const { setCountry } = useCountry();

  const selectCountry = (code: CountryCode) => {
    const selected = countries?.find((c) => c.cca2 === code) || null;
    setCountry(selected);
  };

  useEffect(() => {
    fetchCountrues()
      .then(setCountries)
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  return (
    <header className='bg-background/25 fixed top-0 right-0 left-0 z-50 border-b px-4 backdrop-blur-md'>
      <div className='container mx-auto flex h-14 items-center justify-between'>
        <div className='flex items-center gap-4'>
          <img
            src='/inpost-logo.png'
            alt='InPost Logo'
            className='h-12 w-auto'
          />
          <Separator
            orientation='vertical'
            className='my-1 hidden sm:inline-block'
          />
          <span className='text-muted-foreground hidden font-mono text-sm tracking-widest uppercase sm:inline-block'>
            InPost <span className='text-primary'>Expander</span>
          </span>
        </div>
        <div>
          <Select
            disabled={!countries}
            onValueChange={(value) => selectCountry(value as CountryCode)}
          >
            <SelectTrigger className='w-48'>
              <SelectValue placeholder='Select a country' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Countries</SelectLabel>
                {countries?.map((country) => (
                  <SelectItem key={country.cca2} value={country.cca2}>
                    {country.name.common}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
