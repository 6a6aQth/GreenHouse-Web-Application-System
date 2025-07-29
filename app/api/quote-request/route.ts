import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  // Email sending endpoint: expects { id } in body, triggers if ?email=1 is present
  const url = new URL(req.url);
  if (url.searchParams.get('email')) {
    try {
      // Import nodemailer only when needed (for Next.js compatibility)
      const nodemailer = (await import('nodemailer')).default;
      const { id } = await req.json();
      const quote = await prisma.quoteRequest.findUnique({
        where: { id: Number(id) },
        include: { quoteItems: { include: { product: true } } },
      });
      if (!quote) return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
      // Generate PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      let y = 800;
      const drawText = (text: string, size = 12, color = rgb(0,0,0), x = 50) => {
        page.drawText(text, { x, y, size, font, color });
        y -= size + 6;
      };
      drawText('Greenhouse Company', 20, rgb(0,0.5,0));
      drawText('Quotation', 16, rgb(0,0,0.5));
      y -= 10;
      drawText(`Date: ${new Date(quote.createdAt).toLocaleDateString()}`);
      drawText(`To: ${quote.userName} <${quote.userEmail}> (${quote.userPhone})`);
      y -= 10;
      drawText('Items:', 14);
      drawText('Product           Qty   Price   Notes', 12, rgb(0,0,0), 60);
      y -= 2;
      quote.quoteItems.forEach((item: any) => {
        drawText(`${item.product?.name || 'Unknown'}        ${item.quantity}    ${item.adminPrice ?? '-'}    ${item.notes ?? ''}`, 12, rgb(0,0,0), 60);
      });
      y -= 10;
      if (quote.adminNotes) {
        drawText('Admin Notes:', 12, rgb(0,0,0.5));
        drawText(quote.adminNotes, 12, rgb(0,0,0), 60);
        y -= 10;
      }
      drawText('Standard Terms & Conditions', 12, rgb(0,0.5,0));
      const terms = [
        'All quotes are valid for 30 days from the date of issue.',
        'Payment is due upon acceptance of the quote unless otherwise agreed.',
        'Delivery timelines are estimates and subject to change.',
        'Products remain the property of the company until full payment is received.',
        'Other terms and conditions may apply. Please contact us for details.'
      ];
      terms.forEach((t: string) => drawText(`- ${t}`, 10, rgb(0.2,0.2,0.2), 60));
      const pdfBytes = await pdfDoc.save();
      // Send email using Nodemailer
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      const mailOptions = {
        from: process.env.SMTP_FROM || 'quotes@yourdomain.com',
        to: quote.userEmail,
        subject: 'Your Quotation from Greenhouse',
        text: 'Please find your quotation attached as a PDF. Contact us for any questions.',
        attachments: [{ filename: `quote-${quote.id}.pdf`, content: Buffer.from(pdfBytes), contentType: 'application/pdf' }],
      };
      const info = await transporter.sendMail(mailOptions);
      return NextResponse.json({ ok: true, info });
    } catch (err) {
      return NextResponse.json({ error: 'Failed to send email', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
    }
  }
  try {
    const body = await req.json()
    const { userName, userEmail, userPhone, items } = body
    if (!userName || !userEmail || !userPhone || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const created = await prisma.quoteRequest.create({
      data: {
        userName,
        userEmail,
        userPhone,
        quoteItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity || 1,
            notes: item.notes || null,
          })),
        },
      },
      include: { quoteItems: true },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create quote request' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pdfId = searchParams.get('pdf');
  if (pdfId) {
    // PDF generation endpoint: /api/quote-request?pdf=ID
    try {
      const quote = await prisma.quoteRequest.findUnique({
        where: { id: Number(pdfId) },
        include: { quoteItems: { include: { product: true } } },
      });
      if (!quote) return new Response('Not found', { status: 404 });
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // A4
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      let y = 800;
      const drawText = (text: string, size = 12, color = rgb(0,0,0), x = 50) => {
        page.drawText(text, { x, y, size, font, color });
        y -= size + 6;
      };
      // Header
      drawText('Greenhouse Company', 20, rgb(0,0.5,0));
      drawText('Quotation', 16, rgb(0,0,0.5));
      y -= 10;
      drawText(`Date: ${new Date(quote.createdAt).toLocaleDateString()}`);
      drawText(`To: ${quote.userName} <${quote.userEmail}> (${quote.userPhone})`);
      y -= 10;
      drawText('Items:', 14);
      // Table header
      drawText('Product           Qty   Price   Notes', 12, rgb(0,0,0), 60);
      y -= 2;
      // Items
      quote.quoteItems.forEach(item => {
        drawText(`${item.product?.name || 'Unknown'}        ${item.quantity}    ${item.adminPrice ?? '-'}    ${item.notes ?? ''}`, 12, rgb(0,0,0), 60);
      });
      y -= 10;
      if (quote.adminNotes) {
        drawText('Admin Notes:', 12, rgb(0,0,0.5));
        drawText(quote.adminNotes, 12, rgb(0,0,0), 60);
        y -= 10;
      }
      // Terms
      drawText('Standard Terms & Conditions', 12, rgb(0,0.5,0));
      const terms = [
        'All quotes are valid for 30 days from the date of issue.',
        'Payment is due upon acceptance of the quote unless otherwise agreed.',
        'Delivery timelines are estimates and subject to change.',
        'Products remain the property of the company until full payment is received.',
        'Other terms and conditions may apply. Please contact us for details.'
      ];
      terms.forEach(t => drawText(`- ${t}`, 10, rgb(0.2,0.2,0.2), 60));
      // Finalize
      const pdfBytes = await pdfDoc.save();
      return new Response(pdfBytes, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=quote-${quote.id}.pdf`,
        },
      });
    } catch (err) {
      return new Response('Failed to generate PDF', { status: 500 });
    }
  }
  try {
    const quoteRequests = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        quoteItems: {
          include: { product: true }
        }
      }
    })
    return NextResponse.json(quoteRequests)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quote requests' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, items, adminNotes, status } = body;
    if (!id || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Update quoteRequest
    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: {
        adminNotes: adminNotes || undefined,
        status: status || undefined,
        quoteItems: {
          update: items.map((item: any) => ({
            where: { id: item.id },
            data: {
              adminPrice: item.adminPrice !== undefined ? Number(item.adminPrice) : undefined,
              notes: item.notes || undefined,
            },
          })),
        },
      },
      include: { quoteItems: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update quote request' }, { status: 500 });
  }
} 