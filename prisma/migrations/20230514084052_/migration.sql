/*
  Warnings:

  - You are about to drop the column `productId` on the `ProductImage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productImageId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productImageId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- DropIndex
DROP INDEX "ProductImage_productId_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productImageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "productId";

-- CreateIndex
CREATE UNIQUE INDEX "Product_productImageId_key" ON "Product"("productImageId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productImageId_fkey" FOREIGN KEY ("productImageId") REFERENCES "ProductImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
