import 'dotenv/config';
import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma.js';
import type { InPostApiResponse, InPostPoint } from '@/types/api.js';

async function runSync() {
  const perPage = 100;
  let page = 1;
  let totalPages = 1;

  console.log('🚀 Start Syncing InPost Expander Data...');

  try {
    do {
      const apiUrl = `https://api-global-points.easypack24.net/v1/points?per_page=${perPage}&page=${page}`;
      const res = await fetch(apiUrl);

      const data = (await res.json()) as InPostApiResponse;
      const items = data.items;
      totalPages = data.total_pages;

      console.log(
        `📦 Processing page ${page}/${totalPages} (${items.length} items)`
      );

      await Promise.all(
        items.map((item: InPostPoint) => {
          const address = item.address_details;

          const lockerData: Prisma.LockerCreateInput = {
            id: item.name,
            status: item.status,
            latitude: item.location.latitude,
            longitude: item.location.longitude,
            city: address?.city || 'N/A',
            street: address?.street || 'N/A',
            buildingNumber: address?.building_number || '',
            postCode: address?.post_code || '00-000',
            type: item.type[0] === 'parcel_locker' ? 'locker' : 'point',
            imageUrl: item.image_url,
            locationDescription: item.location_description,
          };

          return prisma.locker.upsert({
            where: { id: item.name },
            update: lockerData,
            create: lockerData,
          });
        })
      );

      await prisma.$executeRaw`
        UPDATE "Locker" 
        SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
        WHERE location IS NULL;
      `;

      page++;
    } while (page <= totalPages);

    console.log('✅ Sync Completed Successfully!');
  } catch (error) {
    console.error('❌ Sync Failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runSync();
