import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma.js';
import type { Expander } from '@inpost-expander/types';

export const expandersRepository = {
  async getOsmQuery(west: number, south: number, east: number, north: number) {
    const bbox = `${south},${west},${north},${east}`;
    return `[out:json][timeout:25];(
      node["building"~"residential|apartments|house|yes"](${bbox});
      way["building"~"residential|apartments|house|yes"](${bbox});
      relation["building"~"residential|apartments|house|yes"](${bbox});
    );
    out center;`;
  },

  async saveBuildings(buildings: { lat: number; lon: number }[]) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "BuildingOSM"`);

    if (buildings.length === 0) return;
    console.log('TERAZ BEZPIECZNIEJ');
    try {
      const values = buildings.map(
        (b) =>
          Prisma.sql`(gen_random_uuid(), ST_SetSRID(ST_MakePoint(${b.lon}, ${b.lat}), 4326)::geography)`
      );

      await prisma.$executeRaw`
      INSERT INTO "BuildingOSM" ("id", "location") 
      VALUES ${Prisma.join(values)}
    `;
    } catch (error) {
      console.error('Błąd zapisu budynków:', error);
      throw error;
    }
  },

  async getExpanders(west: number, south: number, east: number, north: number) {
    return prisma.$queryRaw<Expander[]>`
    WITH grid AS (
      SELECT (ST_Dump(ST_GeneratePoints(
        ST_MakeEnvelope(${west}, ${south}, ${east}, ${north}, 4326), 25
      ))).geom
    ),
    scored_points AS (
      SELECT 
        ST_X(geom)::float as longitude,
        ST_Y(geom)::float as latitude,
        (
          SELECT COUNT(*)::int 
          FROM "BuildingOSM" b 
          WHERE ST_DWithin(b.location, geom::geography, 300)
        ) as "buildingDensity",
        (
          SELECT ST_Distance(l.location, geom::geography)
          FROM "Locker" l
          ORDER BY l.location <-> geom::geography
          LIMIT 1
        )::float as "distanceToNearest"
      FROM grid
    )
    SELECT 
      longitude, 
      latitude, 
      'suggestion' as type, 
      "distanceToNearest",
      "buildingDensity",
      ("buildingDensity" * "distanceToNearest") as score
    FROM scored_points
    WHERE "distanceToNearest" > 150
    ORDER BY score DESC
    LIMIT 15;
  `;
  },
};
