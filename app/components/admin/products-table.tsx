import Image from 'next/image'
import Link from 'next/link'
import { Prisma } from '../../../generated/prisma/client'

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true
    images: true
    variants: true
  }
}>

interface ProductsTableProps {
  products: ProductWithRelations[]
}

function formatPrice(price: Prisma.Decimal | number | string) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(Number(price))
}

function getTotalStock(
  variants: {
    stock: number
    isActive: boolean
  }[]
) {
  return variants
    .filter((variant) => variant.isActive)
    .reduce((acc, variant) => acc + variant.stock, 0)
}

export default function ProductsTable({ products }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
        <h3 className="text-lg font-semibold text-neutral-900">
          No hay productos cargados
        </h3>
        <p className="mt-2 text-sm text-neutral-500">
          Cuando agregues productos, los vas a ver acá.
        </p>

        <Link
          href="/admin/productos/nuevo"
          className="mt-6 inline-flex rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Crear primer producto
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-600">
            <tr className="border-b border-neutral-200">
              <th className="px-4 py-4 font-semibold">Producto</th>
              <th className="px-4 py-4 font-semibold">Categoría</th>
              <th className="px-4 py-4 font-semibold">Precio</th>
              <th className="px-4 py-4 font-semibold">Stock</th>
              <th className="px-4 py-4 font-semibold">Estado</th>
              <th className="px-4 py-4 font-semibold">Destacado</th>
              <th className="px-4 py-4 font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const mainImage = product.images[0]?.url || '/placeholder-product.jpg'
              const totalStock = getTotalStock(product.variants)

              return (
                <tr
                  key={product.id}
                  className="border-b border-neutral-100 align-middle last:border-b-0"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-neutral-100">
                        <Image
                          src={mainImage}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-neutral-900">
                          {product.name}
                        </p>
                        <p className="truncate text-xs text-neutral-500">
                          /productos/{product.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-neutral-700">
                    {product.category.name}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-neutral-900">
                        {formatPrice(product.price)}
                      </span>

                      {product.compareAtPrice && (
                        <span className="text-xs text-neutral-400 line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        totalStock > 0
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {totalStock > 0 ? `${totalStock} unidades` : 'Sin stock'}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        product.isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        product.isFeatured
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {product.isFeatured ? 'Sí' : 'No'}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/productos/${product.id}/editar`}
                        className="inline-flex rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
                      >
                        Editar
                      </Link>

                      <Link
                        href={`/productos/${product.slug}`}
                        target="_blank"
                        className="inline-flex rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
                      >
                        Ver
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}