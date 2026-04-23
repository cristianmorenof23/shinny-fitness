import 'server-only'

import { revalidateTag, unstable_cache } from 'next/cache'
import { prisma } from '@/app/lib/prisma'

type StorefrontProductFilters = {
  search?: string
  categorySlug?: string
  color?: string
  size?: string
  featured?: boolean
  isNew?: boolean
  take?: number
}

export const STOREFRONT_CATALOG_TAG = 'storefront-catalog'

function normalizeSearch(search?: string) {
  const value = search?.trim()
  return value ? value : undefined
}

function isNonEmptyString(value: string | null): value is string {
  return Boolean(value)
}

function logStorefrontError(scope: string, error: unknown) {
  console.error(`Storefront error in ${scope}:`, error)
}

function containsIgnoreCase(value: string | null | undefined, search: string) {
  return value?.toLowerCase().includes(search.toLowerCase()) ?? false
}

const getCachedStorefrontSnapshot = unstable_cache(
  async () => {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          category: {
            isActive: true,
          },
        },
        include: {
          images: {
            orderBy: {
              createdAt: 'asc',
            },
          },
          category: true,
          variants: {
            where: {
              isActive: true,
            },
            orderBy: {
              createdAt: 'asc',
            },
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
      }),
      prisma.category.findMany({
        where: {
          isActive: true,
        },
        include: {
          _count: {
            select: {
              products: {
                where: {
                  isActive: true,
                },
              },
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
    ])

    return {
      products,
      categories,
    }
  },
  ['storefront-catalog-snapshot'],
  {
    revalidate: 300,
    tags: [STOREFRONT_CATALOG_TAG],
  }
)

export async function getStorefrontCatalogSnapshot() {
  try {
    return await getCachedStorefrontSnapshot()
  } catch (error) {
    logStorefrontError('getStorefrontCatalogSnapshot', error)
    return {
      products: [],
      categories: [],
    }
  }
}

export async function getStorefrontProductsByIds(ids: string[]) {
  try {
    const uniqueIds = [...new Set(ids)]

    if (uniqueIds.length === 0) {
      return []
    }

    return await prisma.product.findMany({
      where: {
        id: {
          in: uniqueIds,
        },
        isActive: true,
        category: {
          isActive: true,
        },
      },
      include: {
        images: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        category: true,
        variants: {
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  } catch (error) {
    logStorefrontError('getStorefrontProductsByIds', error)
    return []
  }
}

export function revalidateStorefrontCatalog() {
  revalidateTag(STOREFRONT_CATALOG_TAG, { expire: 0 })
}

export async function getStorefrontProducts(filters: StorefrontProductFilters = {}) {
  const search = normalizeSearch(filters.search)
  const color = normalizeSearch(filters.color)
  const size = normalizeSearch(filters.size)

  try {
    const { products } = await getStorefrontCatalogSnapshot()
    const filteredProducts = products.filter((product) => {
      if (filters.featured && !product.isFeatured) {
        return false
      }

      if (filters.isNew && !product.isNew) {
        return false
      }

      if (filters.categorySlug && product.category.slug !== filters.categorySlug) {
        return false
      }

      if (
        search &&
        ![
          product.name,
          product.slug,
          product.shortDescription,
          product.description,
          product.category.name,
          ...product.variants.flatMap((variant) => [variant.color, variant.size]),
        ].some((value) => containsIgnoreCase(value, search))
      ) {
        return false
      }

      if (
        (color || size) &&
        !product.variants.some(
          (variant) =>
            (!color || variant.color === color) && (!size || variant.size === size)
        )
      ) {
        return false
      }

      return true
    })

    return typeof filters.take === 'number'
      ? filteredProducts.slice(0, filters.take)
      : filteredProducts
  } catch (error) {
    logStorefrontError('getStorefrontProducts', error)
    return []
  }
}

export async function getStorefrontFilterOptions() {
  try {
    const { products } = await getStorefrontCatalogSnapshot()
    const categories = [
      ...new Map(
        products.map((product) => [
          product.category.id,
          {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
          },
        ])
      ).values(),
    ].sort((a, b) => a.name.localeCompare(b.name))

    const colors = [
      ...new Set(
        products
          .flatMap((product) => product.variants.map((variant) => variant.color))
          .filter(isNonEmptyString)
      ),
    ].sort()
    const sizes = [
      ...new Set(
        products
          .flatMap((product) => product.variants.map((variant) => variant.size))
          .filter(isNonEmptyString)
      ),
    ].sort()

    return {
      categories,
      colors,
      sizes,
    }
  } catch (error) {
    logStorefrontError('getStorefrontFilterOptions', error)
    return {
      categories: [],
      colors: [],
      sizes: [],
    }
  }
}

export async function getStorefrontCategories(take?: number) {
  try {
    const { categories } = await getStorefrontCatalogSnapshot()
    return typeof take === 'number' ? categories.slice(0, take) : categories
  } catch (error) {
    logStorefrontError('getStorefrontCategories', error)
    return []
  }
}

export async function getStorefrontProductBySlug(slug: string) {
  try {
    const { products } = await getStorefrontCatalogSnapshot()
    return products.find((product) => product.slug === slug) ?? null
  } catch (error) {
    logStorefrontError('getStorefrontProductBySlug', error)
    return null
  }
}

export async function searchStorefrontProducts(query: string, take = 6) {
  const normalizedQuery = normalizeSearch(query)

  if (!normalizedQuery) {
    return []
  }

  try {
    const { products } = await getStorefrontCatalogSnapshot()

    return products
      .filter((product) =>
        [
          product.name,
          product.slug,
          product.shortDescription,
          product.description,
          product.category.name,
          ...product.variants.flatMap((variant) => [variant.color, variant.size]),
        ].some((value) => containsIgnoreCase(value, normalizedQuery))
      )
      .slice(0, take)
  } catch (error) {
    logStorefrontError('searchStorefrontProducts', error)
    return []
  }
}
