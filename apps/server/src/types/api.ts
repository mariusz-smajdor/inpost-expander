interface InPostLocation {
  latitude: number;
  longitude: number;
}

interface InPostAddress {
  city: string;
  street: string;
  building_number: string;
  post_code: string;
}

export interface InPostPoint {
  name: string;
  status: string;
  location: InPostLocation;
  address_details: InPostAddress;
  type: string[];
  image_url: string | null;
  location_description: string | null;
}

export interface InPostApiResponse {
  items: InPostPoint[];
  count: number;
  total_pages: number;
}
