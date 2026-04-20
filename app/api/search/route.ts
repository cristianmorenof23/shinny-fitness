import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim()

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        {
          name: {
            contains: query,
          },
        },
        {
          shortDescription: {
            contains: query,
          },
        },
        {
          description: {
            contains: query,
          },
        },
        {
          category: {
            name: {
              contains: query,
            },
          },
        },
      ],
    },
    include: {
      category: true,
      images: {
        orderBy: {
          createdAt: 'asc',
        },
        take: 1,
      },
    },
    orderBy: [
      {
        isFeatured: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
    take: 6,
  })

  return NextResponse.json({
    results: products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      category: product.category.name,
      image: product.images[0]?.url || '/placeholder-product.jpg',
    })),
  })
}
