/*
  Warnings:

  - You are about to drop the column `user_id` on the `WalletHistory` table. All the data in the column will be lost.
  - Added the required column `trip_id` to the `WalletHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WalletHistory" DROP CONSTRAINT "WalletHistory_user_id_fkey";

-- DropIndex
DROP INDEX "WalletHistory_user_id_idx";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "walletId" INTEGER;

-- AlterTable
ALTER TABLE "WalletHistory" DROP COLUMN "user_id",
ADD COLUMN     "trip_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "WalletHistory_trip_id_idx" ON "WalletHistory"("trip_id");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletHistory" ADD CONSTRAINT "WalletHistory_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
