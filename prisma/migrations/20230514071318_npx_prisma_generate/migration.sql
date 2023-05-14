/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "isDeleted",
ALTER COLUMN "status" DROP DEFAULT;

-- DropTable
DROP TABLE "ProductImage";

-- DropEnum
DROP TYPE "ImageTypes";

-- DropEnum
DROP TYPE "Provider";
