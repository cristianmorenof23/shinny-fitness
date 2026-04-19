import type { Metadata } from 'next'
import { prisma } from '@/app/lib/prisma'
import { createMetadata, siteConfig, truncateDescription } from '@/app/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
        category: true,
      },
    })

    if (!product) {
      return createMetadata({
        title: 'Producto no encontrado',
        description:
          'No encontramos el producto que intentaste visitar en Shiny Fitness.',
        path: `/productos/${slug}`,
        noIndex: true,
      })
    }

    return createMetadata({
      title: product.name,
      description: truncateDescription(
        product.shortDescription ??
          product.description ??
          `Descubri ${product.name} en Shiny Fitness.`
      ),
      path: `/productos/${product.slug}`,
      image: product.images[0]?.url,
      keywords: [product.name, product.category.name, ...siteConfig.keywords],
    })
  } catch {
    return createMetadata({
      title: 'Producto',
      description:
        'Descubri este producto de Shiny Fitness y explora ropa deportiva femenina online.',
      path: `/productos/${slug}`,
      noIndex: true,
    })
  }
}

export default function CategoriaSlug() {
  return <div>CategoriaSlug</div>
}
