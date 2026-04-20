import OrdersTable from '@/app/components/admin/orders-table'
import { requireAdmin } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

export default async function PedidosPage() {
  await requireAdmin()

  const orders = await prisma.order.findMany({
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
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Pedidos</h1>
        <p className="text-sm text-neutral-500">
          Revisa las compras que entran desde la tienda y su estado actual.
        </p>
      </div>

      <OrdersTable orders={orders} />
    </div>
  )
}
