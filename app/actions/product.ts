'use server'

import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  shortDescription: z.string().optional(),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().optional(),
  categoryId: z.string().min(1),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

export async function createProduct(formData: FormData) {
  const raw = Object.fromEntries(formData.entries())

  const parsed = productSchema.safeParse({
    ...raw,
    isFeatured: raw.isFeatured === 'on',
    isNew: raw.isNew === 'on',
    isActive: raw.isActive === 'on',
  })

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  await prisma.product.create({
    data: {
      ...parsed.data,
    },
  })

  revalidatePath('/admin/productos')
  revalidatePath('/productos')

  return { ok: true }
}