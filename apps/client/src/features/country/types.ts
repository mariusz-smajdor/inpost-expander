import { INPOST_COUNTRIES } from './constants';

export type CountryCode = (typeof INPOST_COUNTRIES)[number]['code'];
type CountryName = (typeof INPOST_COUNTRIES)[number]['name'];

export type Country = {
  cca2: CountryCode;
  name: {
    common: CountryName;
  };
  latlng: [number, number];
};
