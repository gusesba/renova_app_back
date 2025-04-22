-- CreateTable
CREATE TABLE "SellProduct" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sellId" TEXT NOT NULL,

    CONSTRAINT "SellProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sell" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,

    CONSTRAINT "Sell_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SellProduct_userId_idx" ON "SellProduct"("userId");

-- CreateIndex
CREATE INDEX "SellProduct_productId_idx" ON "SellProduct"("productId");

-- CreateIndex
CREATE INDEX "SellProduct_id_idx" ON "SellProduct"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SellProduct_userId_productId_key" ON "SellProduct"("userId", "productId");

-- CreateIndex
CREATE INDEX "Sell_userId_idx" ON "Sell"("userId");

-- CreateIndex
CREATE INDEX "Sell_clientId_idx" ON "Sell"("clientId");

-- CreateIndex
CREATE INDEX "Sell_id_idx" ON "Sell"("id");

-- AddForeignKey
ALTER TABLE "SellProduct" ADD CONSTRAINT "SellProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellProduct" ADD CONSTRAINT "SellProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellProduct" ADD CONSTRAINT "SellProduct_sellId_fkey" FOREIGN KEY ("sellId") REFERENCES "Sell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sell" ADD CONSTRAINT "Sell_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sell" ADD CONSTRAINT "Sell_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
