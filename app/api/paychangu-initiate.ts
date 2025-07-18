import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const payload = req.body;
  const secret = process.env.PAYCHANGU_SECRET;
  if (!secret) return res.status(500).json({ message: 'PAYCHANGU_SECRET env variable not set' });

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
    res.status(payRes.status).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
} 