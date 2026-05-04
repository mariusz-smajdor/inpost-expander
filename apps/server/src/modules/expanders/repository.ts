import { prisma } from '@/lib/prisma.js';
import type { Expander } from '@inpost-expander/types';

export const expandersRepository = {
  // Generuje zapytanie do Overpass API
  async getOsmQuery(west: number, south: number, east: number, north: number) {
    const bbox = `${south},${west},${north},${east}`;
    return `[out:json][timeout:25];(node["building"="residential"](${bbox});way["building"="residential"](${bbox});relation["building"="residential"](${bbox}););out center;`;
  },

  // Zapisuje budynki do bazy (bulk insert)
  async saveBuildings(buildings: { lat: number; lon: number }[]) {
    // 1. Czyścimy stare wyniki
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "BuildingOSM"`);

    if (buildings.length === 0) return;

    // 2. Dodajemy gen_random_uuid() w kolumnie id
    // Upewnij się, że nazwa kolumny w INSERT odpowiada Twojej strukturze (id, location)
    const values = buildings
      .map(
        (b) =>
          `(gen_random_uuid(), ST_SetSRID(ST_MakePoint(${b.lon}, ${b.lat}), 4326)::geography)`
      )
      .join(',');

    await prisma.$executeRawUnsafe(`
    INSERT INTO "BuildingOSM" ("id", "location") VALUES ${values}
  `);
  },

  // Główna logika analizy lokalizacji
  async getExpanders(west: number, south: number, east: number, north: number) {
    return prisma.$queryRaw<Expander[]>`
      WITH grid AS (
        -- Generujemy siatkę 25 potencjalnych punktów
        SELECT (ST_Dump(ST_GeneratePoints(
          ST_MakeEnvelope(${west}, ${south}, ${east}, ${north}, 4326), 25
        ))).geom
      ),
      scored_points AS (
        SELECT 
          ST_X(geom)::float as longitude,
          ST_Y(geom)::float as latitude,
          -- Liczymy budynki w promieniu 300m
          (
            SELECT COUNT(*)::int 
            FROM "BuildingOSM" b 
            WHERE ST_DWithin(b.location, geom::geography, 300)
          ) as "buildingDensity",
          -- Dystans do najbliższego paczkomatu
          (
            SELECT ST_Distance(l.location, geom::geography)
            FROM "Locker" l
            ORDER BY l.location <-> geom::geography
            LIMIT 1
          )::float as "distanceToNearest"
        FROM grid
      )
      SELECT 
        longitude, latitude, 'suggestion' as type, "distanceToNearest",
        -- Wynik: im więcej budynków i im dalej od innych paczkomatów, tym lepiej
        ("buildingDensity" * "distanceToNearest") as score
      FROM scored_points
      WHERE "distanceToNearest" > 150 -- Nie stawiamy pod samym paczkomatem
      ORDER BY score DESC
      LIMIT 15;
    `;
  },
};
