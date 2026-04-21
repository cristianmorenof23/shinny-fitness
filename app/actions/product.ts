'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

const productVariantSchema = z
  .object({
    color: z.string().trim().optional(),
    size: z.string().trim().optional(),
    stock: z.coerce.number().int().min(0),
    sku: z.string().trim().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((value) => Boolean(value.color || value.size), {
    message: 'Cada variante debe tener al menos color o talle.',
  })

const baseProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(5),
  shortDescription: z.string().optional(),
  price: z.coerce.number().positive(),
  compareAtPrice: z
    .union([z.coerce.number().positive(), z.literal(''), z.undefined()])
    .optional(),
  categoryId: z.string().min(1),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  isActive: z.boolean(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string().optional(),
      })
    )
    .optional(),
  variants: z.array(productVariantSchema).optional(),
})

type ProductInput = {
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: string
  compareAtPrice?: string
  categoryId: string
  isFeatured: boolean
  isNew: boolean
  isActive: boolean
  images?: {
    url: string
    alt?: string
  }[]
  variants?: {
    color?: string
    size?: string
    stock: string | number
    sku?: string
    isActive?: boolean
  }[]
}

function parseProduct(data: ProductInput) {
  return baseProductSchema.safeParse({
    ...data,
    compareAtPrice: data.compareAtPrice ? data.compareAtPrice : undefined,
    images: data.images ?? [],
    variants: (data.variants ?? []).filter(
      (variant) =>
        variant.color?.trim() ||
        variant.size?.trim() ||
        Number(variant.stock) > 0 ||
        variant.sku?.trim()
    ),
  })
}

function mapProductData(
  parsed: z.infer<typeof baseProductSchema>
): Parameters<typeof prisma.product.create>[0]['data'] {
  return {
    name: parsed.name,
    slug: parsed.slug,
    description: parsed.description,
    shortDescription: parsed.shortDescription || null,
    price: parsed.price,
    compareAtPrice:
      parsed.compareAtPrice === '' || parsed.compareAtPrice == null
        ? null
        : Number(parsed.compareAtPrice),
    categoryId: parsed.categoryId,
    isFeatured: parsed.isFeatured,
    isNew: parsed.isNew,
    isActive: parsed.isActive,
    images: {
      create: (parsed.images ?? []).map((image) => ({
        url: image.url,
        alt: image.alt || null,
      })),
    },
    variants: {
      create: (parsed.variants ?? []).map((variant) => ({
        color: variant.color || null,
        size: variant.size || null,
        stock: variant.stock,
        sku: variant.sku || null,
        isActive: variant.isActive ?? true,
      })),
    },
  }
}

function revalidateProductPaths(slug?: string) {
  revalidatePath('/admin/productos')
  revalidatePath('/admin')
  revalidatePath('/productos')
  revalidatePath('/')
  if (slug) {
    revalidatePath(`/productos/${slug}`)
  }
}

export async function createProduct(data: ProductInput) {
  await requireAdmin()

  const parsed = parseProduct(data)

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const existingSlug = await prisma.product.findUnique({
    where: { slug: parsed.data.slug },
  })

  if (existingSlug) {
    return {
      ok: false,
      errors: {
        slug: ['Ya existe un producto con ese slug'],
      },
    }
  }

  await prisma.product.create({
    data: mapProductData(parsed.data),
  })

  revalidateProductPaths(parsed.data.slug)

  return {
    ok: true,
    redirectTo: '/admin/productos',
  }
}

export async function updateProduct(productId: string, data: ProductInput) {
  await requireAdmin()

  const parsed = parseProduct(data)

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const existingSlug = await prisma.product.findFirst({
    where: {
      slug: parsed.data.slug,
      id: {
        not: productId,
      },
    },
  })

  if (existingSlug) {
    return {
      ok: false,
      errors: {
        slug: ['Ya existe un producto con ese slug'],
      },
    }
  }

  const current = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      slug: true,
    },
  })

  if (!current) {
    return {
      ok: false,
      errors: {
        name: ['No encontramos el producto a editar.'],
      },
    }
  }

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      ...mapProductData(parsed.data),
      images: {
        deleteMany: {},
        create: (parsed.data.images ?? []).map((image) => ({
          url: image.url,
          alt: image.alt || null,
        })),
      },
      variants: {
        deleteMany: {},
        create: (parsed.data.variants ?? []).map((variant) => ({
          color: variant.color || null,
          size: variant.size || null,
          stock: variant.stock,
          sku: variant.sku || null,
          isActive: variant.isActive ?? true,
        })),
      },
    },
  })

  revalidateProductPaths(current.slug)
  revalidateProductPaths(parsed.data.slug)

  return {
    ok: true,
    redirectTo: '/admin/productos',
  }
}
