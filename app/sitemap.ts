import type { MetadataRoute } from 'next'
import { absoluteUrl } from './lib/seo'
import { getStorefrontCatalogSnapshot } from './lib/storefront'

const staticRoutes = [
  {
    url: absoluteUrl('/'),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  },
  {
    url: absoluteUrl('/productos'),
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.95,
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
  {
    url: absoluteUrl('/envios'),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  },
  {
    url: absoluteUrl('/terminos'),
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  },
  {
    url: absoluteUrl('/privacidad'),
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const { products, categories } = await getStorefrontCatalogSnapshot()

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
