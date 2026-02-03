-- AlterTable
ALTER TABLE "availability_slot" ADD COLUMN     "daysOfWeek" TEXT[],
ADD COLUMN     "isBooked" BOOLEAN NOT NULL DEFAULT false;
