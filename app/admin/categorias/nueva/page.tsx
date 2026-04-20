import CategoryForm from '@/app/components/admin/category-form'
import { requireAdmin } from '@/app/lib/auth'

export default async function NuevaCategoriaPage() {
  await requireAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Nueva categoria</h1>
        <p className="text-sm text-neutral-500">
          Crea una categoria para organizar productos y mostrarla en la tienda.
        </p>
      </div>

      <div className="max-w-2xl">
        <CategoryForm />
      </div>
    </div>
  )
}
