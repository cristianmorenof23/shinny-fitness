import type { MetadataRoute } from 'next'
import { prisma } from './lib/prisma'
import { absoluteUrl } from './lib/seo'

const staticRoutes = [
  {
    url: absoluteUrl('/'),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  },
  {
    url: absoluteUrl('/contacto'),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  },
  {
    url: absoluteUrl('/sobre-mi'),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
    ])

    return [
      ...staticRoutes,
      ...products.map((product) => ({
        url: absoluteUrl(`/productos/${product.slug}`),
        lastModified: product.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...categories.map((category) => ({
        url: absoluteUrl(`/categorias/${category.slug}`),
        lastModified: category.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticRoutes
  }
}
