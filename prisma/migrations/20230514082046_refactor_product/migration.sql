/*
  Warnings:

  - You are about to drop the column `productImageId` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId]` on the table `ProductImage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_productImageId_fkey";

-- DropIndex
DROP INDEX "Product_productImageId_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "productImageId";

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "productId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductImage_productId_key" ON "ProductImage"("productId");

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
