type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  isActive: boolean
  createdAt: Date
}

interface CategoriesTableProps {
  categories: Category[]
}

export default function CategoriesTable({
  categories,
}: CategoriesTableProps) {
  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
        <h3 className="text-lg font-semibold text-neutral-900">
          No hay categorías creadas
        </h3>
        <p className="mt-2 text-sm text-neutral-500">
          Creá la primera categoría para poder cargar productos.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-600">
            <tr className="border-b border-neutral-200">
              <th className="px-4 py-4 font-semibold">Nombre</th>
              <th className="px-4 py-4 font-semibold">Slug</th>
              <th className="px-4 py-4 font-semibold">Estado</th>
              <th className="px-4 py-4 font-semibold">Fecha</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-b border-neutral-100 last:border-b-0"
              >
                <td className="px-4 py-4 font-medium text-neutral-900">
                  {category.name}
                </td>
                <td className="px-4 py-4 text-neutral-600">{category.slug}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      category.isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {category.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-4 py-4 text-neutral-600">
                  {new Date(category.createdAt).toLocaleDateString('es-AR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}