import Image from 'next/image'
import Link from 'next/link'
import DeleteCategoryButton from '@/app/components/admin/delete-category-button'

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
          No hay categorias creadas
        </h3>
        <p className="mt-2 text-sm text-neutral-500">
          Crea la primera categoria para poder cargar productos.
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
              <th className="px-4 py-4 font-semibold">Categoria</th>
              <th className="px-4 py-4 font-semibold">Slug</th>
              <th className="px-4 py-4 font-semibold">Estado</th>
              <th className="px-4 py-4 font-semibold">Fecha</th>
              <th className="px-4 py-4 font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-b border-neutral-100 last:border-b-0"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-neutral-100">
                      {category.imageUrl ? (
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#d9c6b2,_#8b684d_55%,_#2d241e)]" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium text-neutral-900">{category.name}</p>
                      {category.description ? (
                        <p className="line-clamp-1 text-xs text-neutral-500">
                          {category.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
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
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/categorias/${category.id}/editar`}
                      className="inline-flex rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/categorias/${category.slug}`}
                      target="_blank"
                      className="inline-flex rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
                    >
                      Ver
                    </Link>
                    <DeleteCategoryButton
                      categoryId={category.id}
                      categoryName={category.name}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
