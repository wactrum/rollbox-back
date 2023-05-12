-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryLocationId" INTEGER;

-- CreateTable
CREATE TABLE "DeliveryLocation" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "isPrivateHouse" BOOLEAN NOT NULL DEFAULT false,
    "apartment" TEXT,
    "porch" TEXT,
    "floor" TEXT,
    "comment" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "DeliveryLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryLocation_address_userId_key" ON "DeliveryLocation"("address", "userId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryLocationId_fkey" FOREIGN KEY ("deliveryLocationId") REFERENCES "DeliveryLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryLocation" ADD CONSTRAINT "DeliveryLocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
