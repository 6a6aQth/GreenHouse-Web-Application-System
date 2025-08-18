-- DropForeignKey
ALTER TABLE "QuoteItem" DROP CONSTRAINT "QuoteItem_quoteRequestId_fkey";

-- AddForeignKey
ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "QuoteRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
