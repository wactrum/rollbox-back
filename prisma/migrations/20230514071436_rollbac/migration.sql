-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('LOCAL');

-- CreateEnum
CREATE TYPE "ImageTypes" AS ENUM ('PRODUCT');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'CREATED';

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
