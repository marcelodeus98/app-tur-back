/*
  Warnings:

  - Added the required column `schedule_date` to the `Trips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seats_booked` to the `Trips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Packages" ADD COLUMN     "available_seats" INTEGER;

-- AlterTable
ALTER TABLE "Trips" ADD COLUMN     "schedule_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "seats_booked" INTEGER NOT NULL;
