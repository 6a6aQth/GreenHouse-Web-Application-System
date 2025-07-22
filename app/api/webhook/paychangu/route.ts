import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  let payload;
  try {
    payload = await req.json();
  } catch (err) {
    console.error('Invalid JSON in webhook:', err);
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  console.log('PayChangu Webhook received:', JSON.stringify(payload, null, 2));

  const tx_ref = payload?.tx_ref || payload?.data?.tx_ref;
  const status = payload?.status || payload?.data?.status;
  const amount = payload?.amount || payload?.data?.amount;
  const currency = payload?.currency || payload?.data?.currency;
  const email = payload?.email || payload?.data?.email;

  if (!tx_ref || !status) {
    return NextResponse.json({ error: 'Missing tx_ref or status' }, { status: 400 });
  }

  try {
    await prisma.transaction.upsert({
      where: { tx_ref },
      update: {
        status,
        amount: amount ? Number(amount) : 0,
        currency: currency || '',
        email: email || null,
      },
      create: {
        tx_ref,
        status,
        amount: amount ? Number(amount) : 0,
        currency: currency || '',
        email: email || null,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Error upserting transaction from webhook:', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
} 