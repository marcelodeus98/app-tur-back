-- AlterTable
ALTER TABLE "Packages" ADD COLUMN     "vehicle_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Packages" ADD CONSTRAINT "Packages_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
