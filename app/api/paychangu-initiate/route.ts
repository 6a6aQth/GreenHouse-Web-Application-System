import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const secret = process.env.PAYCHANGU_SECRET;
  if (!secret) return NextResponse.json({ message: 'PAYCHANGU_SECRET env variable not set' }, { status: 500 });

  // Log the payload for debugging
  console.log("PayChangu payload:", JSON.stringify(payload, null, 2));

  try {
    const payRes = await fetch('https://api.paychangu.com/payment', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secret}`
      },
      body: JSON.stringify(payload)
    });
    const data = await payRes.json();
    return NextResponse.json(data, { status: payRes.status });
  } catch (err) {
    return NextResponse.json({ message: 'Server error', error: err }, { status: 500 });
  }
} 