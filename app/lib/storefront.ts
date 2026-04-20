import 'server-only'

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

export async function getStorefrontProducts(filters: StorefrontProductFilters = {}) {
  const search = normalizeSearch(filters.search)
  const color = normalizeSearch(filters.color)
  const size = normalizeSearch(filters.size)

  try {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: filters.featured ? true : undefined,
        isNew: filters.isNew ? true : undefined,
        category: filters.categorySlug
          ? {
              slug: filters.categorySlug,
              isActive: true,
            }
          : {
              isActive: true,
            },
        OR: search
          ? [
              {
                name: {
                  contains: search,
                },
              },
              {
                shortDescription: {
                  contains: search,
                },
              },
              {
                description: {
                  contains: search,
                },
              },
            ]
          : undefined,
        variants:
          color || size
            ? {
                some: {
                  isActive: true,
                  color: color ?? undefined,
                  size: size ?? undefined,
                },
              }
            : undefined,
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
      take: filters.take,
    })
  } catch (error) {
    logStorefrontError('getStorefrontProducts', error)
    return []
  }
}

export async function getStorefrontFilterOptions() {
  try {
    const [categories, variants] = await Promise.all([
      prisma.category.findMany({
        where: {
          isActive: true,
          products: {
            some: {
              isActive: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),
      prisma.productVariant.findMany({
        where: {
          isActive: true,
          product: {
            isActive: true,
            category: {
              isActive: true,
            },
          },
        },
        select: {
          color: true,
          size: true,
        },
      }),
    ])

    const colors = [
      ...new Set(variants.map((variant) => variant.color).filter(isNonEmptyString)),
    ].sort()
    const sizes = [
      ...new Set(variants.map((variant) => variant.size).filter(isNonEmptyString)),
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
    return await prisma.category.findMany({
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
      take,
    })
  } catch (error) {
    logStorefrontError('getStorefrontCategories', error)
    return []
  }
}
