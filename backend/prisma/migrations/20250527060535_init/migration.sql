/*
  Warnings:

  - You are about to drop the column `addressLine1` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine2` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `address_detail` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `ward` on the `users` table. All the data in the column will be lost.
  - Added the required column `addressDetail` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ward` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` DROP COLUMN `addressLine1`,
    DROP COLUMN `addressLine2`,
    DROP COLUMN `city`,
    ADD COLUMN `addressDetail` VARCHAR(191) NOT NULL,
    ADD COLUMN `ward` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `address_detail`,
    DROP COLUMN `district`,
    DROP COLUMN `province`,
    DROP COLUMN `ward`;
