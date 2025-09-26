import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { readFile } from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient();

// Helper function to create a professional PDF
async function createProfessionalPDF(quote: any) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]); // A4 size

  // Embed fonts
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const primaryGreen = rgb(0.2, 0.7, 0.3); // Vibrant green from logo
  const accentGreen = rgb(0.15, 0.6, 0.25); // Darker green for depth
  const navyBlue = rgb(0.1, 0.2, 0.4); // Navy blue from logo text
  const lightGreen = rgb(0.9, 0.98, 0.92); // Very light green background
  const textColor = rgb(0.15, 0.15, 0.15); // Darker text for better contrast
  const white = rgb(1, 1, 1);
  const black = rgb(0, 0, 0);

  // Margins and positioning
  const margin = 50;
  const contentWidth = 495;
  let y = 792; // Start from top

  // Helpers
  const drawText = (
    text: string,
    size: number,
    font: any,
    x: number,
    yPos: number,
    color = textColor,
    bold = false,
  ) => {
    const currentFont = bold ? helveticaBold : font;
    page.drawText(text, { x, y: yPos, size, font: currentFont, color });
  };

  const drawRect = (x: number, y: number, width: number, height: number, color: any, fill = false) => {
    if (fill) {
      page.drawRectangle({ x, y, width, height, color });
    } else {
      page.drawRectangle({ x, y, width, height, borderColor: color, borderWidth: 1 });
    }
  };

  // Simple wrapping helper
  const wrapText = (text: string, maxWidth: number, size = 10, font: any = helvetica): string[] => {
    const words = String(text || "").split(" ");
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const test = (line ? line + " " : "") + word;
      if (font.widthOfTextAtSize(test, size) > maxWidth) {
        if (line) lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  // Currency formatter
  const formatCurrency = (value: number) =>
    `K${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Page-break helpers
  const newBlankPage = () => {
    page = pdfDoc.addPage([595, 842]);
    y = 792;
  };

  const startNewPageForItems = (continuedLabel = "Requested Products & Services (continued)") => {
    newBlankPage();
    drawRect(margin, y - 5, contentWidth, 25, lightGreen, true);
    drawText(continuedLabel, 14, helveticaBold, margin + 15, y + 5, primaryGreen, true);
    y -= 35;
    drawTableHeader();
  };

  const ensureSpaceForItems = (requiredHeight: number) => {
    if (y - requiredHeight < 120) startNewPageForItems();
  };

  const ensureSpaceGeneric = (requiredHeight: number) => {
    if (y - requiredHeight < 120) newBlankPage();
  };

  // Table header drawing (re-usable)
  const colStart = margin + 15;
  const colWidths = [220, 70, 90, 115]; // Product, Qty, Unit Price, Total
  const colPositions = [
    colStart, // Product
    colStart + colWidths[0], // Qty
    colStart + colWidths[0] + colWidths[1], // Unit Price
    colStart + colWidths[0] + colWidths[1] + colWidths[2], // Total
  ];
  const drawTableHeader = () => {
    const tableHeaderHeight = 30;
    drawRect(margin, y - tableHeaderHeight + 15, contentWidth, tableHeaderHeight, primaryGreen, true);
    drawText("Product / Service", 12, helveticaBold, colPositions[0], y - 8, white, true);
    drawText("Qty", 12, helveticaBold, colPositions[1] + 10, y - 8, white, true);
    drawText("Unit Price", 12, helveticaBold, colPositions[2] + 5, y - 8, white, true);
    drawText("Total", 12, helveticaBold, colPositions[3] + 5, y - 8, white, true);
    y -= tableHeaderHeight + 15;
  };

  // Big header (first page only) with logo and title
  const headerHeight = 120;
  // Logo
  try {
    const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.png');
    const logoBytes = await readFile(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const logoWidth = 140;
    const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
    page.drawImage(logoImage, { x: margin, y: y - logoHeight, width: logoWidth, height: logoHeight });
  } catch {}

  // Title block (wrap if necessary)
  const titleX = margin + 170;
  const titleMaxWidth = contentWidth - 170;
  const titleLines = wrapText("Premium Greenhouse & Agricultural Solutions", titleMaxWidth, 18, helveticaBold);
  let titleY = y - 20;
  for (const line of titleLines) {
    drawText(line, 18, helveticaBold, titleX, titleY, black, true);
    titleY -= 22;
  }
  // Removed explicit "Quotation" label per request

  // Invoice block below logo/title, styled like other sections
  const invoiceNumber = `INV-${quote.id.toString().padStart(4, '0')}`;
  const invoiceDate = new Date(quote.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  y -= headerHeight;
  drawText('INVOICE:', 12, helveticaBold, margin, y - 8, black, true);
  drawText(`Invoice Number: ${invoiceNumber}`, 11, helvetica, margin, y - 24, black);
  drawText(`Date: ${invoiceDate}`, 11, helvetica, margin, y - 40, black);
  y -= 60;

  // BILL TO and PAYMENT INFORMATION blocks
  const leftBoxWidth = (contentWidth - 20) / 2;
  const boxHeight = 90;
  // Bill To (no border/box)
  drawText('BILL TO:', 12, helveticaBold, margin, y - 5, black, true);
  drawText(quote.userName, 11, helvetica, margin, y - 22, black);
  drawText(quote.userEmail, 11, helvetica, margin, y - 38, black);
  drawText(quote.userPhone, 11, helvetica, margin, y - 54, black);

  // Payment Info
  const payRightX = margin + leftBoxWidth + 20;
  drawText('PAYMENT INFORMATION:', 12, helveticaBold, payRightX, y - 5, black, true);
  drawText('Bank: National Bank Of Malawi', 11, helvetica, payRightX, y - 22, black);
  drawText('Name: SmartGreenHouse', 11, helvetica, payRightX, y - 38, black);
  drawText('Account: 0123 4567 8901', 11, helvetica, payRightX, y - 54, black);

  y -= boxHeight + 30;

  // Products section
  drawRect(margin, y - 5, contentWidth, 25, lightGreen, true);
  drawText("Requested Products & Services", 16, helveticaBold, margin + 15, y + 5, primaryGreen, true);
  y -= 35;
  drawTableHeader();

  // Items
  let totalAmount = 0;
  const isRenderableNote = (_value?: string) => false; // Item notes hidden on PDF

  for (let i = 0; i < quote.quoteItems.length; i++) {
    // Reserve ~50px per row
    ensureSpaceForItems(50);

    const item = quote.quoteItems[i];
    const rowHeight = 35;
    const bgColor = i % 2 === 0 ? white : rgb(0.98, 1, 0.98);

    // Row background
    drawRect(margin, y - rowHeight + 20, contentWidth, rowHeight, bgColor, true);
    drawRect(margin, y - rowHeight + 20, contentWidth, rowHeight, rgb(0.9, 0.9, 0.9));

    // Product name
    const productName = item.product?.name || "Custom Product";
    const truncatedName = productName.length > 28 ? productName.substring(0, 25) + "..." : productName;
    drawText(truncatedName, 11, helveticaBold, colPositions[0], y - 8, textColor, true);

    // Item notes intentionally omitted from PDF

    // Quantity
    drawText(String(item.quantity ?? 1), 11, helvetica, colPositions[1] + 10, y - 8, textColor);

    // Unit Price
    const unitPrice = Number(item.adminPrice) || 0;
    const priceText = unitPrice > 0 ? formatCurrency(unitPrice) : "TBD";
    drawText(priceText, 11, helvetica, colPositions[2] + 5, y - 8, textColor);

    // Line total
    const lineTotal = unitPrice * Number(item.quantity ?? 1);
    const totalText = unitPrice > 0 ? formatCurrency(lineTotal) : "TBD";
    drawText(totalText, 11, helveticaBold, colPositions[3] + 5, y - 8, primaryGreen, true);

    if (unitPrice > 0) totalAmount += lineTotal;

    y -= rowHeight + 8;
  }

  // Totals
  ensureSpaceGeneric(120);
  y -= 15;
  const totalBoxWidth = 200;
  const totalBoxHeight = 80;
  drawRect(margin + contentWidth - totalBoxWidth, y - totalBoxHeight + 20, totalBoxWidth, totalBoxHeight, primaryGreen, true);
  drawRect(margin + contentWidth - totalBoxWidth, y - totalBoxHeight + 20, totalBoxWidth, 3, accentGreen, true);
  drawText("TOTAL AMOUNT", 12, helveticaBold, margin + contentWidth - totalBoxWidth + 15, y - 16, white, true);
  drawText(formatCurrency(totalAmount), 22, helveticaBold, margin + contentWidth - totalBoxWidth + 15, y - 46, white, true);
  y -= 85;

  // Admin notes intentionally omitted from PDF

  // Terms
  ensureSpaceGeneric(160);
  drawRect(margin, y - 5, contentWidth, 25, lightGreen, true);
  drawText("Terms & Conditions", 14, helveticaBold, margin + 15, y + 5, primaryGreen, true);
  y -= 35;

  const terms = [
    "• Quote validity: 30 days from issue date",
    "• Payment terms: Net 30 days upon acceptance",
    "• Installation timeline: 2-4 weeks after order confirmation",
    "• Warranty: 2 years on greenhouse structures, 1 year on equipment",
    "• Custom modifications may affect pricing and delivery schedule",
  ];
  for (const term of terms) {
    drawText(term, 10, helvetica, margin + 15, y, textColor);
    y -= 16;
  }
  y -= 25;

  // Footer (wrap long lines like Website and Address)
  ensureSpaceGeneric(200);
  const footerHeight = 110;
  drawRect(margin, y - footerHeight + 15, contentWidth, footerHeight, navyBlue, true);
  drawRect(margin, y - footerHeight + 15, contentWidth, 4, primaryGreen, true);

  const leftX = margin + 20;
  const rightX = margin + 250;
  const colMaxWidth = 220; // approx width for wrapping

  drawText("SMART AGRI SOLUTIONS", 14, helveticaBold, leftX, y - 25, white, true);
  drawText("Your Partner in Sustainable Agriculture", 10, helvetica, leftX, y - 40, rgb(0.8, 0.9, 0.8));
  drawText("Email: quotes@smartagrisolutions.com", 10, helvetica, leftX, y - 55, white);

  const websiteLines = wrapText("Website: www.smartagrisolutions.com", colMaxWidth, 10, helvetica);
  websiteLines.forEach((line, idx) => {
    drawText(line, 10, helvetica, leftX, y - 70 - idx * 13, white);
  });

  drawText("Phone: +1 (555) 123-GROW (4769)", 10, helvetica, rightX, y - 55, white);
  const addressLines = wrapText("Address: 123 Greenhouse Lane, Farm City, FC 12345", colMaxWidth, 10, helvetica);
  addressLines.forEach((line, idx) => {
    drawText(line, 10, helvetica, rightX, y - 70 - idx * 13, white);
  });

  return await pdfDoc.save();
}


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
      
      // Generate professional PDF
      const pdfBytes = await createProfessionalPDF(quote);
      
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
        from: process.env.SMTP_FROM || 'quotes@smartagrisolutions.com',
        to: quote.userEmail,
        subject: 'Your Professional Quotation from Smart Agri Solutions',
        text: 'Please find your professional quotation attached as a PDF. Contact us for any questions.',
        attachments: [{ filename: `quote-${quote.id}.pdf`, content: Buffer.from(pdfBytes), contentType: 'application/pdf' }],
      };
      const info = await transporter.sendMail(mailOptions);
      return NextResponse.json({ ok: true, info });
    } catch (err) {
      return NextResponse.json({ error: 'Failed to send email', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
    }
  }
  try {
    const body = await req.json();
    const { userName, userEmail, userPhone, items } = body;
    if (!userName || !userEmail || !userPhone || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
            adminPrice: item.adminPrice !== undefined ? item.adminPrice : undefined,
            notes: item.notes || null,
          })),
        },
      },
      include: { quoteItems: { include: { product: true } } },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create quote request' }, { status: 500 });
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
      
      // Generate professional PDF
      const pdfBytes = await createProfessionalPDF(quote);
      
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
      include: { quoteItems: { include: { product: true } } },
    });
    return NextResponse.json(quoteRequests);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quote requests' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, userName, userEmail, userPhone, adminNotes, status, items, notes } = body;
    if (!id) {
      return NextResponse.json({ error: 'Missing quote request ID' }, { status: 400 });
    }

    const updateData: any = {};
    if (userName !== undefined) updateData.userName = userName;
    if (userEmail !== undefined) updateData.userEmail = userEmail;
    if (userPhone !== undefined) updateData.userPhone = userPhone;
    if (notes !== undefined) updateData.notes = notes; // Update the main quote request notes
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (status !== undefined) updateData.status = status;

    if (items !== undefined && Array.isArray(items)) {
      const itemsToUpdate = items.filter((item: any) => item.id !== undefined);
      const itemsToCreate = items.filter((item: any) => item.id === undefined);

      if (itemsToUpdate.length > 0) {
        updateData.quoteItems = {
          update: itemsToUpdate.map((item: any) => ({
            where: { id: item.id },
            data: {
              quantity: item.quantity !== undefined ? item.quantity : undefined,
              adminPrice: item.adminPrice !== undefined ? item.adminPrice : undefined,
              notes: item.notes || undefined,
            },
          })),
        };
      }

      if (itemsToCreate.length > 0) {
        updateData.quoteItems = {
          ...(updateData.quoteItems || {}), // Merge with existing update if it exists
          create: itemsToCreate.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity || 1,
            notes: item.notes || null,
          })),
        };
      }
    }

    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: updateData,
      include: { quoteItems: { include: { product: true } } },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update quote request' }, { status: 500 });
  }
} 

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const quoteRequestIdParam = searchParams.get('quoteRequestId');
    const itemIdParam = searchParams.get('itemId');

    const quoteRequestId = quoteRequestIdParam ? Number(quoteRequestIdParam) : undefined;
    const itemId = itemIdParam ? Number(itemIdParam) : undefined;

    if (quoteRequestId === undefined || Number.isNaN(quoteRequestId)) {
      return NextResponse.json({ error: 'Missing or invalid quoteRequestId' }, { status: 400 });
    }

    if (itemId !== undefined && !Number.isNaN(itemId)) {
      // Delete a specific QuoteItem
      await prisma.quoteItem.delete({
        where: { id: itemId, quoteRequestId: quoteRequestId },
      });
      return NextResponse.json({ ok: true, message: 'Quote item deleted successfully.' });
    } else {
      // Delete the entire QuoteRequest (and its items due to cascade delete)
      await prisma.quoteRequest.delete({
        where: { id: quoteRequestId },
      });
      return NextResponse.json({ ok: true, message: 'Quote request and its items deleted successfully.' });
    }
  } catch (error) {
    console.error("Error deleting quote item or request:", error);
    return NextResponse.json({ error: 'Failed to delete quote item or request' }, { status: 500 });
  }
} 