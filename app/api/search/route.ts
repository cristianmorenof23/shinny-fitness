import { NextResponse } from 'next/server'
import { searchStorefrontProducts } from '@/app/lib/storefront'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim()

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const products = await searchStorefrontProducts(query, 6)

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
  } catch (error) {
    console.error('Search route error:', error)
    return NextResponse.json({ results: [] }, { status: 200 })
  }
}
