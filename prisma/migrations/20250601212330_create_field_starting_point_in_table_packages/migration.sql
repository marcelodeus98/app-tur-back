/*
  Warnings:

  - You are about to drop the column `starting_point_id` on the `Packages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Packages" DROP CONSTRAINT "Packages_starting_point_id_fkey";

-- DropIndex
DROP INDEX "Packages_starting_point_id_idx";

-- AlterTable
ALTER TABLE "Packages" DROP COLUMN "starting_point_id",
ADD COLUMN     "starting_point" TEXT;
