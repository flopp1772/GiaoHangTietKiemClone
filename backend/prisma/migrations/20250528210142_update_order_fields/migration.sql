/*
  Warnings:

  - You are about to alter the column `currentStatus` on the `shipment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `shipment` MODIFY `currentStatus` ENUM('PROCESSING', 'SHIPPING', 'DELIVERED') NOT NULL;
