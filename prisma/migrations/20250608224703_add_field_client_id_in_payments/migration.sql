/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Payments` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Payments` table. All the data in the column will be lost.
  - Added the required column `client_id` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "client_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
