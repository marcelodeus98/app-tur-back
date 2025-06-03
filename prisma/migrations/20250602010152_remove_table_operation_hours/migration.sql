/*
  Warnings:

  - You are about to drop the `OperationHours` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OperationHours" DROP CONSTRAINT "OperationHours_driver_id_fkey";

-- AlterTable
ALTER TABLE "Drivers" ADD COLUMN     "operation_hours" JSONB;

-- DropTable
DROP TABLE "OperationHours";

-- DropEnum
DROP TYPE "WeekDayEnum";
