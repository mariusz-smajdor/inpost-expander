interface MapPoint {
  id: string;
  latitude: number;
  longitude: number;
}

export interface Cluster extends MapPoint {
  type: 'cluster';
  count: number;
  west: number;
  south: number;
  east: number;
  north: number;
}

export interface Locker extends MapPoint {
  type: 'point';
  pointType: 'locker' | 'point';
  status: string;
  city: string;
  street: string;
  buildingNumber: string;
  postCode: string;
  locationDescription: string | null;
  imageUrl: string | null;
}
