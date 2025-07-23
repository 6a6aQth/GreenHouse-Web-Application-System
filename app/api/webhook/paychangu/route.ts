import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  // Get raw body for signature check
  const rawBody = await req.text();
  const signature = req.headers.get('signature');
  const webhookSecret = process.env.PAYCHANGU_WEBHOOK_SECRET;

  // Compute HMAC SHA-256
  const computedSignature = crypto
    .createHmac('sha256', webhookSecret || '')
    .update(rawBody)
    .digest('hex');

  if (!webhookSecret || signature !== computedSignature) {
    console.error('Invalid webhook signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch (err) {
    console.error('Invalid JSON in webhook:', err);
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  console.log('PayChangu Webhook received:', JSON.stringify(payload, null, 2));

  const tx_ref = payload?.reference || payload?.tx_ref || payload?.data?.tx_ref;
  if (!tx_ref) {
    return NextResponse.json({ error: 'Missing tx_ref' }, { status: 400 });
  }

  // Re-query PayChangu API to verify transaction (correct endpoint)
  const secret = process.env.PAYCHANGU_SECRET;
  try {
    const verifyRes = await fetch(`https://api.paychangu.com/verify-payment/${tx_ref}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${secret}`,
      },
    });
    const data = await verifyRes.json();
    console.log('PayChangu verify response (webhook):', JSON.stringify(data, null, 2));
    const status = data?.data?.status;
    if (data.status === 'success' && data.data && status === 'success') {
      const txData = data.data;
      try {
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
        console.log('Transaction upserted successfully for tx_ref:', tx_ref);
      } catch (dbErr) {
        console.error('Error upserting transaction in DB:', dbErr);
        return NextResponse.json({ error: 'DB error', details: dbErr instanceof Error ? dbErr.message : String(dbErr) }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ error: 'Payment not successful', data }, { status: 400 });
    }
  } catch (err) {
    console.error('Error verifying transaction from webhook:', err);
    return NextResponse.json({ error: 'Verification error', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 