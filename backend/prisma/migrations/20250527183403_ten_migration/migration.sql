/*
  Warnings:

  - You are about to drop the column `paymentStatus` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `order` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `paymentStatus`,
    DROP COLUMN `totalAmount`,
    ADD COLUMN `note` VARCHAR(191) NULL,
    ADD COLUMN `quantity` INTEGER NOT NULL,
    ADD COLUMN `recipientName` VARCHAR(191) NOT NULL,
    ADD COLUMN `recipientPhone` VARCHAR(191) NULL,
    ADD COLUMN `weight` DOUBLE NOT NULL;
