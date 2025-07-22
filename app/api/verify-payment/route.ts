import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tx_ref = searchParams.get('tx_ref');
  console.log('Verifying payment for tx_ref:', tx_ref);

  if (!tx_ref) {
    return NextResponse.json({ success: false, error: 'Missing tx_ref' }, { status: 400 });
  }

  const secret = process.env.PAYCHANGU_SECRET;
  if (!secret) {
    return NextResponse.json({ success: false, error: 'PAYCHANGU_SECRET not set' }, { status: 500 });
  }

  try {
    // Call PayChangu verify endpoint (corrected)
    const verifyRes = await fetch(`https://api.paychangu.com/transaction/verify?tx_ref=${tx_ref}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${secret}`,
      },
    });
    const data = await verifyRes.json();
    console.log('PayChangu verify response:', JSON.stringify(data, null, 2));

    // Check if payment is successful (adjust according to PayChangu API response)
    if (data?.data?.status === 'successful' || data?.data?.status === 'success') {
      return NextResponse.json({ success: true, data });
    } else {
      return NextResponse.json({ success: false, data });
    }
  } catch (err) {
    console.error('Error verifying payment:', err);
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }
} 