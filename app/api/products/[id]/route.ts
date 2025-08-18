import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    const body = await req.json()
    const { name, description, image, tags, price, category } = body

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name ?? undefined,
        description: description ?? undefined,
        image: image ?? undefined,
        tags: Array.isArray(tags)
          ? tags
          : typeof tags === 'string'
            ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
            : undefined,
        price: price !== undefined ? String(price) : undefined,
        category: category ?? undefined,
      },
    })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}

