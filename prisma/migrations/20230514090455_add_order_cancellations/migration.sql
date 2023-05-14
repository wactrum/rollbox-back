-- CreateTable
CREATE TABLE "OrderCancellations" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "OrderCancellations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderCancellations_orderId_key" ON "OrderCancellations"("orderId");

-- AddForeignKey
ALTER TABLE "OrderCancellations" ADD CONSTRAINT "OrderCancellations_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
