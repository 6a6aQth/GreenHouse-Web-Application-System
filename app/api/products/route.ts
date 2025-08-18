import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany({ orderBy: { id: 'asc' } })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
} 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name,
      description,
      image,
      tags,
      price,
      category,
    } = body

    if (!name || !category || price === undefined || price === null) {
      return NextResponse.json({ error: 'Missing required fields: name, category, price' }, { status: 400 })
    }

    const created = await prisma.product.create({
      data: {
        name,
        description: description ?? '',
        image: image ?? '',
        tags: Array.isArray(tags) ? tags : (typeof tags === 'string' && tags.length ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []),
        price: typeof price === 'number' ? String(price) : String(price),
        category,
      },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}