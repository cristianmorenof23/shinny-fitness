'use server'

import { prisma } from '@/app/lib/prisma'
import { requireAdmin } from '@/app/lib/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const createProductSchema = z.object({
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
})

export async function createProduct(data: {
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
}) {
  await requireAdmin()

  const parsed = createProductSchema.safeParse({
    ...data,
    compareAtPrice: data.compareAtPrice ? data.compareAtPrice : undefined,
    images: data.images ?? [],
  })

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
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      shortDescription: parsed.data.shortDescription || null,
      price: parsed.data.price,
      compareAtPrice:
        parsed.data.compareAtPrice === '' || parsed.data.compareAtPrice == null
          ? null
          : Number(parsed.data.compareAtPrice),
      categoryId: parsed.data.categoryId,
      isFeatured: parsed.data.isFeatured,
      isNew: parsed.data.isNew,
      isActive: parsed.data.isActive,
      images: {
        create: (parsed.data.images ?? []).map((image) => ({
          url: image.url,
          alt: image.alt || null,
        })),
      },
    },
  })

  revalidatePath('/admin/productos')
  revalidatePath('/productos')

  return {
    ok: true,
    redirectTo: '/admin/productos',
  }
}
