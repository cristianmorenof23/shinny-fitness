import { prisma } from '@/app/lib/prisma'
import { requireAdmin } from '@/app/lib/auth'
import { Prisma } from '../../generated/prisma/client'
import ProductsTable from '../components/admin/products-table'

type AdminProduct = Prisma.ProductGetPayload<{
  include: {
    category: true
    images: true
    variants: true
  }
}>

function getDatabaseErrorMessage(error: unknown) {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    if (
      message.includes('authentication failed') ||
      message.includes('provided database credentials') ||
      message.includes('p1000')
    ) {
      return 'No se pudo autenticar con la base de datos. Revisá DATABASE_URL y las credenciales MySQL de Hostinger.'
    }
  }

  return 'No se pudieron cargar los productos del panel en este momento.'
}

export default async function AdminProductsPage() {
  await requireAdmin()

  let products: AdminProduct[] | null = null
  let errorMessage: string | null = null

  try {
    products = await prisma.product.findMany({
      include: {
        category: true,
        images: true,
        variants: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

  } catch (error) {
    console.error('Error loading admin products:', error)
    errorMessage = getDatabaseErrorMessage(error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Productos</h1>
          <p className="text-sm text-neutral-500">
            Gestioná el catálogo de la tienda
          </p>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
          <h2 className="text-lg font-semibold">No pudimos conectar el panel</h2>
          <p className="mt-2 text-sm leading-6 text-amber-900">{errorMessage}</p>
          <p className="mt-3 text-sm leading-6 text-amber-900">
            Cuando corrijas la conexión en Hostinger, recargá esta página para
            volver a intentar la consulta.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/admin"
              className="inline-flex rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Reintentar
            </a>
            <a
              href="/admin/productos/nuevo"
              className="inline-flex rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
            >
              Ir a crear producto
            </a>
          </div>
        </div>
      ) : (
        <ProductsTable products={products ?? []} />
      )}
    </div>
  )
}
