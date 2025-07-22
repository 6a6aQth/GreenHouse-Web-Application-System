import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const secret = process.env.PAYCHANGU_SECRET;
  if (!secret) return NextResponse.json({ error: 'PAYCHANGU_SECRET env variable not set' }, { status: 500 });

  // Validate required fields
  const { amount, email, first_name, last_name, currency = 'MWK', meta, customization } = body;
  if (!amount || !email || !first_name || !last_name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Generate unique tx_ref
  const tx_ref = `paychangu-${Date.now()}-${randomUUID()}`;

  // Prepare payload
  const payload = {
    amount,
    currency,
    email,
    first_name,
    last_name,
    callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://greenhouse.midascreed.com'}/payment/verifying`,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://greenhouse.midascreed.com'}/payment/status`,
    tx_ref,
    customization,
    meta,
  };
  console.log('Initiating PayChangu payment with payload:', JSON.stringify(payload, null, 2));

  try {
    const payRes = await fetch('https://api.paychangu.com/payment', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secret}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await payRes.json();
    if (data?.data?.checkout_url) {
      return NextResponse.json({ checkout_url: data.data.checkout_url, tx_ref });
    } else {
      return NextResponse.json({ error: data.message || 'Could not initiate payment.' }, { status: 500 });
    }
  } catch (err) {
    console.error('Error initiating PayChangu payment:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 