/*
  Warnings:

  - You are about to drop the column `vehicle_id` on the `Drivers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Drivers" DROP CONSTRAINT "Drivers_vehicle_id_fkey";

-- DropIndex
DROP INDEX "Drivers_vehicle_id_idx";

-- AlterTable
ALTER TABLE "Drivers" DROP COLUMN "vehicle_id";

-- CreateTable
CREATE TABLE "DriverVehicles" (
    "id" SERIAL NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "vehicle_id" INTEGER NOT NULL,

    CONSTRAINT "DriverVehicles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DriverVehicles_driver_id_idx" ON "DriverVehicles"("driver_id");

-- CreateIndex
CREATE INDEX "DriverVehicles_vehicle_id_idx" ON "DriverVehicles"("vehicle_id");

-- AddForeignKey
ALTER TABLE "DriverVehicles" ADD CONSTRAINT "DriverVehicles_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverVehicles" ADD CONSTRAINT "DriverVehicles_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
