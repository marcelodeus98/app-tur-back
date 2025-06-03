-- CreateEnum
CREATE TYPE "WeekDayEnum" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateTable
CREATE TABLE "OperationHours" (
    "id" SERIAL NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "week_day" "WeekDayEnum" NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "break_start" TIMESTAMP(3),
    "break_end" TIMESTAMP(3),
    "end_time" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperationHours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OperationHours_driver_id_idx" ON "OperationHours"("driver_id");

-- AddForeignKey
ALTER TABLE "OperationHours" ADD CONSTRAINT "OperationHours_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
