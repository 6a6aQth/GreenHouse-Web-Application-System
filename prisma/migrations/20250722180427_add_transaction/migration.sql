-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "tx_ref" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_tx_ref_key" ON "Transaction"("tx_ref");
