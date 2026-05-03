import { prisma } from '@/lib/prisma.js';
import type { Locker, Cluster } from '@inpost-expander/types';

export const lockersRepository = {
  async getClusters(
    west: number,
    south: number,
    east: number,
    north: number,
    diff: number
  ) {
    return prisma.$queryRaw<Cluster[]>`
      SELECT 
        MIN(name) as id, 
        AVG(latitude) as latitude, 
        AVG(longitude) as longitude,
        COUNT(*)::int as count,
        'cluster' as type,
        ST_XMin(ST_Extent(location::geometry)) as west,
        ST_YMin(ST_Extent(location::geometry)) as south,
        ST_XMax(ST_Extent(location::geometry)) as east,
        ST_YMax(ST_Extent(location::geometry)) as north
      FROM "Locker"
      WHERE location && ST_MakeEnvelope(${west}, ${south}, ${east}, ${north}, 4326)
      GROUP BY ST_SnapToGrid(location::geometry, ${diff / 10})
      LIMIT 200;
    `;
  },

  async getPoints(west: number, south: number, east: number, north: number) {
    return prisma.$queryRaw<Locker[]>`
      SELECT 
        name as id, latitude, longitude, status, city, street,
        building_number as "buildingNumber",
        post_code as "postCode",
        image_url as "imageUrl",
        location_description as "locationDescription",
        type as "pointType",
        'point' as type
      FROM "Locker"
      WHERE location && ST_MakeEnvelope(${west}, ${south}, ${east}, ${north}, 4326)
      LIMIT 500;
    `;
  },
};
