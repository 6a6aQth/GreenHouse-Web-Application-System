import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tx_ref = searchParams.get('tx_ref');
  console.log('VERIFY PAYMENT ROUTE HIT', tx_ref);

  if (!tx_ref) {
    return NextResponse.json({ success: false, error: 'Missing tx_ref' }, { status: 400 });
  }

  const secret = process.env.PAYCHANGU_SECRET;
  if (!secret) {
    return NextResponse.json({ success: false, error: 'PAYCHANGU_SECRET not set' }, { status: 500 });
  }

  try {
    // Call PayChangu verify endpoint (correct endpoint)
    const verifyRes = await fetch(`https://api.paychangu.com/verify-payment/${tx_ref}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${secret}`,
      },
    });
    const data = await verifyRes.json();
    console.log('PayChangu verify response:', JSON.stringify(data, null, 2));

    // Check for success status (adjust if needed based on real response)
    if (data.status === 'success' && data.data && data.data.status === 'success') {
      // Upsert transaction
      const txData = data.data;
      await prisma.transaction.upsert({
        where: { tx_ref },
        update: {
          status: txData.status,
          amount: txData.amount ? Number(txData.amount) : 0,
          currency: txData.currency || '',
          email: txData.customer?.email || null,
        },
        create: {
          tx_ref,
          status: txData.status,
          amount: txData.amount ? Number(txData.amount) : 0,
          currency: txData.currency || '',
          email: txData.customer?.email || null,
        },
      });
      // Create QuoteRequest if meta is present and not already created
      const meta = txData.meta;
      if (meta && meta.userName && meta.userEmail && meta.phone && Array.isArray(meta.items)) {
        const existingQuote = await prisma.quoteRequest.findFirst({ where: { tx_ref } });
        if (!existingQuote) {
          await prisma.quoteRequest.create({
            data: {
              userName: meta.userName,
              userEmail: meta.userEmail,
              userPhone: meta.phone,
              tx_ref,
              quoteItems: {
                create: meta.items.map((item: any) => ({
                  productId: Number(item.productId),
                  quantity: item.quantity || 1,
                  notes: item.notes || null,
                })),
              },
            },
          });
          console.log('QuoteRequest created for tx_ref:', tx_ref);
        } else {
          console.log('QuoteRequest already exists for tx_ref:', tx_ref);
        }
      }
      return NextResponse.json({ success: true, data });
    } else {
      return NextResponse.json({ success: false, data });
    }
  } catch (err) {
    console.error('Error verifying payment:', err);
    return NextResponse.json({ success: false, error: 'Verification failed', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 