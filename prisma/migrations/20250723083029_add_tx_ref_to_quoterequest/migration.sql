-- AlterTable
ALTER TABLE "QuoteRequest" ADD COLUMN     "tx_ref" TEXT;

-- CreateIndex
CREATE INDEX "QuoteRequest_tx_ref_idx" ON "QuoteRequest"("tx_ref");
