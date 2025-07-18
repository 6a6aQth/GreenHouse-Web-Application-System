import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
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