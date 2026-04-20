import ProductForm from '@/app/components/admin/product-form'
import { requireAdmin } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

function getDatabaseErrorMessage(error: unknown) {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    if (
      message.includes('authentication failed') ||
      message.includes('provided database credentials') ||
      message.includes('p1000')
    ) {
      return 'No se pudo autenticar con la base de datos. Revisa DATABASE_URL y las credenciales MySQL de Hostinger.'
    }
  }

  return 'No se pudieron cargar las categorias necesarias para crear el producto.'
}

export default async function NewProductPage() {
  await requireAdmin()

  let categories: { id: string; name: string }[] = []
  let errorMessage: string | null = null

  try {
    categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
      },
    })
  } catch (error) {
    console.error('Error loading categories for new product:', error)
    errorMessage = getDatabaseErrorMessage(error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nuevo producto</h1>
        <p className="text-sm text-neutral-500">
          Completa los datos para crear un producto.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
          <h2 className="text-lg font-semibold">No pudimos cargar el formulario</h2>
          <p className="mt-2 text-sm leading-6 text-amber-900">{errorMessage}</p>
          <p className="mt-3 text-sm leading-6 text-amber-900">
            Cuando se restablezca la conexion, recarga esta pagina para volver a
            intentar la carga de categorias.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/admin/productos/nuevo"
              className="inline-flex rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Reintentar
            </a>
            <a
              href="/admin/productos"
              className="inline-flex rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
            >
              Volver a productos
            </a>
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">
            Primero crea una categoria
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Los productos necesitan una categoria activa para poder guardarse y
            mostrarse correctamente en la tienda.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/admin/categorias"
              className="inline-flex rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Ir a categorias
            </a>
            <a
              href="/admin/categorias/nueva"
              className="inline-flex rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
            >
              Crear nueva categoria
            </a>
          </div>
        </div>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  )
}
