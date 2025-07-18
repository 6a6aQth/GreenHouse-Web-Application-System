import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { tx_ref, status, meta } = data;

  // 1. Verify the transaction with PayChangu
  const verifyRes = await fetch('https://api.paychangu.com/transaction/verify', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PAYCHANGU_SECRET}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ tx_ref }),
  });
  const verifyData = await verifyRes.json();

  if (verifyData.status === 'success' && verifyData.data.status === 'successful') {
    // 2. Save the quote request to your DB using meta
    if (!meta || !meta.userName || !meta.userEmail || !meta.userPhone || !Array.isArray(meta.items)) {
      return NextResponse.json({ ok: false, message: 'Missing meta info for quote request.' }, { status: 400 });
    }
    await prisma.quoteRequest.create({
      data: {
        userName: meta.userName,
        userEmail: meta.userEmail,
        userPhone: meta.userPhone,
        quoteItems: {
          create: meta.items.map((item: any) => ({
            productId: Number(item.productId),
            quantity: item.quantity || 1,
            notes: item.notes || null,
          })),
        },
      },
    });
    return NextResponse.json({ ok: true, message: 'Payment verified and quote saved.' });
  } else {
    return NextResponse.json({ ok: false, message: 'Payment not successful.' }, { status: 400 });
  }
} 