-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateTable
CREATE TABLE "Locker" (
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "building_number" TEXT,
    "post_code" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "image_url" TEXT,
    "location_description" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "location" geography(Point, 4326),

    CONSTRAINT "Locker_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "BuildingOSM" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" geography(Point, 4326) NOT NULL,

    CONSTRAINT "BuildingOSM_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "location_idx" ON "Locker" USING GIST ("location");

-- CreateIndex
CREATE INDEX "BuildingOSM_location_idx" ON "BuildingOSM" USING GIST ("location");
