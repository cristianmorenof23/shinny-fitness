import Link from 'next/link'
import { Prisma } from '../../../generated/prisma/client'
import AdminPagination from '@/app/components/admin/admin-pagination'
import { AdminFiltersForm } from '@/app/components/admin/admin-filters-form'
import OrdersTable from '@/app/components/admin/orders-table'
import { requireAdmin } from '@/app/lib/auth'
import { isDatabaseCapacityError, isDatabaseSchemaError } from '@/app/lib/database-errors'
import { prisma } from '@/app/lib/prisma'

type OrdersPageSearchParams = {
  q?: string
  estado?: string
  pago?: string
  page?: string
}

type AdminOrder = Prisma.OrderGetPayload<{
  include: {
    _count: {
      select: {
        items: true
      }
    }
  }
}>

const ORDERS_PER_PAGE = 12

function normalizePage(value?: string) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return Math.floor(parsed)
}

function getOrdersErrorMessage(error: unknown) {
  if (isDatabaseCapacityError(error)) {
    return 'No pudimos cargar los pedidos del panel porque Hostinger alcanzo el limite horario de conexiones MySQL o esta saturado.'
  }

  if (isDatabaseSchemaError(error)) {
    return 'No pudimos cargar los pedidos del panel porque hay cambios pendientes entre Prisma y MySQL.'
  }

  return 'No se pudieron cargar las compras del panel en este momento.'
}

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<OrdersPageSearchParams>
}) {
  await requireAdmin()

  const params = await searchParams
  const query = params.q?.trim()
  const page = normalizePage(params.page)

  let orders: AdminOrder[] = []
  let totalOrders = 0
  let errorMessage: string | null = null

  try {
    const where: Prisma.OrderWhereInput = {
      status: params.estado
        ? {
            equals: params.estado as Prisma.EnumOrderStatusFilter['equals'],
          }
        : undefined,
      paymentMethod:
        params.pago === 'mercadopago'
          ? {
              equals: 'mercadopago',
            }
          : params.pago === 'gocuotas'
            ? {
                equals: 'gocuotas',
              }
            : params.pago === 'transferencia'
              ? {
                  equals: 'transferencia',
                }
            : undefined,
      mercadopagoStatus:
        params.pago === 'approved'
          ? {
              equals: 'approved',
            }
          : params.pago === 'pending'
            ? {
                equals: 'pending',
              }
            : params.pago === 'rejected'
              ? {
                  equals: 'rejected',
                }
              : params.pago === 'sin_novedad'
                ? null
                : undefined,
      OR: query
        ? [
            {
              customerName: {
                contains: query,
              },
            },
            {
              customerEmail: {
                contains: query,
              },
            },
            {
              id: {
                contains: query,
              },
            },
            {
              externalReference: {
                contains: query,
              },
            },
            {
              mercadopagoId: {
                contains: query,
              },
            },
            {
              paymentMethod: {
                contains: query,
              },
            },
            {
              mercadopagoStatus: {
                contains: query,
              },
            },
          ]
        : undefined,
    }

    const [loadedOrders, loadedTotal] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        include: {
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * ORDERS_PER_PAGE,
        take: ORDERS_PER_PAGE,
      }),
      prisma.order.count({
        where,
      }),
    ])

    orders = loadedOrders
    totalOrders = loadedTotal
  } catch (error) {
    console.error('Error loading admin orders:', error)
    errorMessage = getOrdersErrorMessage(error)
  }

  const totalPages = Math.max(1, Math.ceil(totalOrders / ORDERS_PER_PAGE))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Pedidos</h1>
        <p className="text-sm text-neutral-500">
          Revisa las compras que entran desde la tienda y su estado actual.
        </p>
      </div>

      <AdminFiltersForm
        clearHref="/admin/pedidos"
        className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:grid-cols-[minmax(0,1fr)_220px_220px_auto]"
      >
        <input
          type="text"
          name="q"
          defaultValue={params.q ?? ''}
          placeholder="Buscar cliente, email, pedido o pago"
          className="h-11 rounded-xl border border-neutral-300 px-4 text-sm outline-none transition focus:border-neutral-900"
        />

        <select
          name="estado"
          defaultValue={params.estado ?? ''}
          className="h-11 rounded-xl border border-neutral-300 px-4 text-sm outline-none transition focus:border-neutral-900"
        >
          <option value="">Todos los estados</option>
          <option value="PENDING">Pendiente</option>
          <option value="PAID">Pagado</option>
          <option value="CANCELLED">Cancelado</option>
          <option value="SHIPPED">Enviado</option>
          <option value="DELIVERED">Entregado</option>
        </select>

        <select
          name="pago"
          defaultValue={params.pago ?? ''}
          className="h-11 rounded-xl border border-neutral-300 px-4 text-sm outline-none transition focus:border-neutral-900"
        >
          <option value="">Todos los pagos</option>
          <option value="mercadopago">Mercado Pago</option>
          <option value="gocuotas">GoCuotas</option>
          <option value="transferencia">Transferencia</option>
          <option value="approved">Cobro aprobado</option>
          <option value="pending">Cobro pendiente</option>
          <option value="rejected">Cobro rechazado</option>
          <option value="sin_novedad">Sin novedad</option>
        </select>
      </AdminFiltersForm>

      {errorMessage ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
          <h2 className="text-lg font-semibold">No pudimos conectar el panel</h2>
          <p className="mt-2 text-sm leading-6 text-amber-900">{errorMessage}</p>
          <p className="mt-3 text-sm leading-6 text-amber-900">
            Cuando la conexion vuelva a estar disponible, recarga esta pagina
            para reintentar la consulta de ventas.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/admin/pedidos"
              className="inline-flex rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Reintentar
            </Link>
          </div>
        </div>
      ) : (
        <>
          <OrdersTable orders={orders} />
          <AdminPagination
            page={Math.min(page, totalPages)}
            totalPages={totalPages}
            totalItems={totalOrders}
            pageSize={ORDERS_PER_PAGE}
            basePath="/admin/pedidos"
            searchParams={params}
            itemLabel="pedidos"
          />
        </>
      )}
    </div>
  )
}
