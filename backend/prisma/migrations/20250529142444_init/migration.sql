/*
  Warnings:

  - You are about to drop the column `courierId` on the `shipment` table. All the data in the column will be lost.
  - You are about to drop the `courier` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `shipperId` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `shipment` DROP FOREIGN KEY `Shipment_courierId_fkey`;

-- DropIndex
DROP INDEX `Shipment_courierId_fkey` ON `shipment`;

-- AlterTable
ALTER TABLE `shipment` DROP COLUMN `courierId`,
    ADD COLUMN `shipperId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `courier`;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_shipperId_fkey` FOREIGN KEY (`shipperId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
