import Link from 'next/link'
import { notFound } from 'next/navigation'
import CategoryForm from '@/app/components/admin/category-form'
import { requireAdmin } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()

  const { id } = await params

  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  })

  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Editar categoria
          </h1>
          <p className="text-sm text-neutral-500">
            Actualiza la informacion visual y el estado de esta categoria.
          </p>
        </div>

        <Link
          href="/admin/categorias"
          className="inline-flex rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
        >
          Volver a categorias
        </Link>
      </div>

      <div className="max-w-3xl">
        <CategoryForm
          defaultValues={{
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            imageUrl: category.imageUrl,
            isActive: category.isActive,
          }}
        />
      </div>
    </div>
  )
}
