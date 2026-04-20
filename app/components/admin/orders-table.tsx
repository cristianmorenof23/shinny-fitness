import Link from 'next/link'

type AdminOrder = {
  id: string
  customerName: string
  customerEmail: string
  total: number | { toString(): string }
  status: string
  paymentMethod: string | null
  mercadopagoStatus: string | null
  createdAt: Date
  _count: {
    items: number
  }
}

function formatPrice(value: number | { toString(): string }) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(Number(value))
}

function getStatusLabel(status: string) {
  const map: Record<string, { label: string; className: string }> = {
    PENDING: {
      label: 'Pendiente',
      className: 'bg-amber-100 text-amber-700',
    },
    PAID: {
      label: 'Pagado',
      className: 'bg-emerald-100 text-emerald-700',
    },
    CANCELLED: {
      label: 'Cancelado',
      className: 'bg-red-100 text-red-700',
    },
    SHIPPED: {
      label: 'Enviado',
      className: 'bg-blue-100 text-blue-700',
    },
    DELIVERED: {
      label: 'Entregado',
      className: 'bg-violet-100 text-violet-700',
    },
  }

  return (
    map[status] ?? {
      label: status,
      className: 'bg-neutral-200 text-neutral-700',
    }
  )
}

export default function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
        <h3 className="text-lg font-semibold text-neutral-900">
          Todavia no hay compras registradas
        </h3>
        <p className="mt-2 text-sm text-neutral-500">
          Cuando las clientas empiecen a comprar, vas a ver los pedidos aca.
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
              <th className="px-4 py-4 font-semibold">Pedido</th>
              <th className="px-4 py-4 font-semibold">Cliente</th>
              <th className="px-4 py-4 font-semibold">Items</th>
              <th className="px-4 py-4 font-semibold">Total</th>
              <th className="px-4 py-4 font-semibold">Estado</th>
              <th className="px-4 py-4 font-semibold">Pago</th>
              <th className="px-4 py-4 font-semibold">Fecha</th>
              <th className="px-4 py-4 font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const status = getStatusLabel(order.status)

              return (
                <tr
                  key={order.id}
                  className="border-b border-neutral-100 align-middle last:border-b-0"
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold text-neutral-900">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {order.paymentMethod ?? 'Sin metodo'}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-neutral-900">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {order.customerEmail}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-neutral-700">
                    {order._count.items}
                  </td>

                  <td className="px-4 py-4 font-medium text-neutral-900">
                    {formatPrice(order.total)}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-neutral-700">
                    {order.mercadopagoStatus ?? 'Sin novedad'}
                  </td>

                  <td className="px-4 py-4 text-neutral-700">
                    {new Date(order.createdAt).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>

                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="inline-flex rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
                    >
                      Ver detalle
                    </Link>
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
