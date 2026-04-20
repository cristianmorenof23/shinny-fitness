import CategoriesTable from '@/app/components/admin/categories-table'
import CategoryForm from '@/app/components/admin/category-form'
import { requireAdmin } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export default async function CategoriasPage() {
  await requireAdmin()

  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Categorías</h1>
        <p className="text-sm text-neutral-500">
          Creá y gestioná las categorías para organizar los productos.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
        <CategoryForm />
        <CategoriesTable categories={categories} />
      </div>
    </div>
  )
}