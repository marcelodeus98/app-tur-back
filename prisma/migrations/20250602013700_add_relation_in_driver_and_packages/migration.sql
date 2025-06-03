-- AlterTable
ALTER TABLE "Drivers" ALTER COLUMN "status" SET DEFAULT 'APPROVED';

-- AlterTable
ALTER TABLE "Packages" ADD COLUMN     "driver_id" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "Packages_driver_id_idx" ON "Packages"("driver_id");

-- AddForeignKey
ALTER TABLE "Packages" ADD CONSTRAINT "Packages_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
