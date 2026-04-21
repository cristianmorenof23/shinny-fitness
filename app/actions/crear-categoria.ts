'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

const categorySchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  slug: z.string().min(2, 'El slug es obligatorio'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean(),
})

type CategoryInput = {
  name: string
  slug: string
  description?: string
  imageUrl?: string
  isActive: boolean
}

function revalidateCategoryPaths(slug?: string) {
  revalidatePath('/admin/categorias')
  revalidatePath('/admin/categorias/nueva')
  revalidatePath('/admin/productos/nuevo')
  revalidatePath('/productos')
  revalidatePath('/')
  if (slug) {
    revalidatePath(`/categorias/${slug}`)
  }
}

export async function createCategory(data: CategoryInput) {
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
        slug: ['Ya existe una categoria con ese slug'],
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

  revalidateCategoryPaths(parsed.data.slug)

  return { ok: true, redirectTo: '/admin/categorias' }
}

export async function updateCategory(categoryId: string, data: CategoryInput) {
  await requireAdmin()

  const parsed = categorySchema.safeParse(data)

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const currentCategory = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      slug: true,
    },
  })

  if (!currentCategory) {
    return {
      ok: false,
      errors: {
        name: ['No encontramos la categoria a editar.'],
      },
    }
  }

  const existingSlug = await prisma.category.findFirst({
    where: {
      slug: parsed.data.slug,
      id: {
        not: categoryId,
      },
    },
  })

  if (existingSlug) {
    return {
      ok: false,
      errors: {
        slug: ['Ya existe una categoria con ese slug'],
      },
    }
  }

  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      imageUrl: parsed.data.imageUrl || null,
      isActive: parsed.data.isActive,
    },
  })

  revalidateCategoryPaths(currentCategory.slug)
  revalidateCategoryPaths(parsed.data.slug)
  revalidatePath(`/admin/categorias/${categoryId}/editar`)

  return { ok: true, redirectTo: '/admin/categorias' }
}
