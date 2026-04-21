import Link from 'next/link'
import { Prisma } from '../../../generated/prisma/client'
import AdminPagination from '@/app/components/admin/admin-pagination'
import ProductsTable from '@/app/components/admin/products-table'
import { requireAdmin } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

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
      return 'No se pudo autenticar con la base de datos. Revisa DATABASE_URL y las credenciales MySQL de Hostinger.'
    }
  }

  return 'No se pudieron cargar los productos del panel en este momento.'
}

type ProductsPageSearchParams = {
  q?: string
  categoria?: string
  estado?: string
  page?: string
}

const PRODUCTS_PER_PAGE = 10

function normalizePage(value?: string) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return Math.floor(parsed)
}

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<ProductsPageSearchParams>
}) {
  await requireAdmin()

  const params = await searchParams
  const query = params.q?.trim()
  const page = normalizePage(params.page)

  let products: AdminProduct[] | null = null
  let categories: { id: string; name: string; slug: string }[] = []
  let totalProducts = 0
  let errorMessage: string | null = null

  try {
    const where: Prisma.ProductWhereInput = {
      category: params.categoria
        ? {
            slug: params.categoria,
          }
        : undefined,
      isActive:
        params.estado === 'activos'
          ? true
          : params.estado === 'inactivos'
            ? false
            : undefined,
      OR: query
        ? [
            {
              name: {
                contains: query,
              },
            },
            {
              slug: {
                contains: query,
              },
            },
            {
              category: {
                name: {
                  contains: query,
                },
              },
            },
          ]
        : undefined,
    }

    const [loadedProducts, loadedCategories, loadedTotal] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: true,
          variants: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * PRODUCTS_PER_PAGE,
        take: PRODUCTS_PER_PAGE,
      }),
      prisma.category.findMany({
        orderBy: {
          name: 'asc',
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),
      prisma.product.count({
        where,
      }),
    ])

    products = loadedProducts
    categories = loadedCategories
    totalProducts = loadedTotal
  } catch (error) {
    console.error('Error loading admin products:', error)
    errorMessage = getDatabaseErrorMessage(error)
  }

  const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Productos</h1>
          <p className="text-sm text-neutral-500">
            Gestiona el catalogo de la tienda con busqueda, filtros y variantes.
          </p>
        </div>

        <Link
          href="/admin/productos/nuevo"
          className="inline-flex rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Nuevo producto
        </Link>
      </div>

      <form className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:grid-cols-[minmax(0,1fr)_220px_180px_auto]">
        <input
          type="text"
          name="q"
          defaultValue={params.q ?? ''}
          placeholder="Buscar por nombre, slug o categoria"
          className="h-11 rounded-xl border border-neutral-300 px-4 text-sm outline-none transition focus:border-neutral-900"
        />

        <select
          name="categoria"
          defaultValue={params.categoria ?? ''}
          className="h-11 rounded-xl border border-neutral-300 px-4 text-sm outline-none transition focus:border-neutral-900"
        >
          <option value="">Todas las categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          name="estado"
          defaultValue={params.estado ?? ''}
          className="h-11 rounded-xl border border-neutral-300 px-4 text-sm outline-none transition focus:border-neutral-900"
        >
          <option value="">Todos los estados</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>

        <div className="flex gap-3">
          <button
            type="submit"
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Filtrar
          </button>
          <Link
            href="/admin/productos"
            className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            Limpiar
          </Link>
        </div>
      </form>

      {errorMessage ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
          <h2 className="text-lg font-semibold">No pudimos conectar el panel</h2>
          <p className="mt-2 text-sm leading-6 text-amber-900">{errorMessage}</p>
          <p className="mt-3 text-sm leading-6 text-amber-900">
            Cuando corrijas la conexion en Hostinger, recarga esta pagina para
            volver a intentar la consulta.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/admin/productos"
              className="inline-flex rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Reintentar
            </Link>
            <Link
              href="/admin/productos/nuevo"
              className="inline-flex rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
            >
              Ir a crear producto
            </Link>
          </div>
        </div>
      ) : (
        <>
          <ProductsTable products={products ?? []} />
          <AdminPagination
            page={Math.min(page, totalPages)}
            totalPages={totalPages}
            totalItems={totalProducts}
            pageSize={PRODUCTS_PER_PAGE}
            basePath="/admin/productos"
            searchParams={params}
            itemLabel="productos"
          />
        </>
      )}
    </div>
  )
}
