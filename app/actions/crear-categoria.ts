'use server'

import { requireAdmin } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  slug: z.string().min(2, 'El slug es obligatorio'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean(),
})

export async function createCategory(data: {
  name: string
  slug: string
  description?: string
  imageUrl?: string
  isActive: boolean
}) {
  await requireAdmin()

  const parsed = categorySchema.safeParse(data)

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const existingSlug = await prisma.category.findUnique({
    where: { slug: parsed.data.slug },
  })

  if (existingSlug) {
    return {
      ok: false,
      errors: {
        slug: ['Ya existe una categoría con ese slug'],
      },
    }
  }

  await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      imageUrl: parsed.data.imageUrl || null,
      isActive: parsed.data.isActive,
    },
  })

  revalidatePath('/admin/categorias')
  revalidatePath('/admin/productos/nuevo')
  revalidatePath('/productos')
  revalidatePath('/')

  return { ok: true }
}
