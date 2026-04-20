import Link from 'next/link'
import { notFound } from 'next/navigation'
import { OrderStatusForm } from '@/app/components/admin/order-status-form'
import { requireAdmin } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'

function formatPrice(value: number | { toString(): string }) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(Number(value))
}

function formatVariantLabel(color?: string | null, size?: string | null) {
  const parts = [color, size].filter(Boolean)
  return parts.length > 0 ? parts.join(' - ') : 'Sin variante registrada'
}

export default async function PedidosSlugPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()

  const { id } = await params
  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Pedido
          </p>
          <h1 className="mt-2 text-2xl font-bold text-neutral-900">
            #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Creado el{' '}
            {new Date(order.createdAt).toLocaleString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <Link
          href="/admin/pedidos"
          className="inline-flex rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
        >
          Volver a pedidos
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">
            Productos comprados
          </h2>

          <div className="mt-5 space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-neutral-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {item.product.name}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      Cantidad: {item.quantity}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {formatVariantLabel(item.variant?.color, item.variant?.size)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-medium text-neutral-900">
                      {formatPrice(item.unitPrice)}
                    </p>
                    <p className="text-sm text-neutral-500">
                      Subtotal: {formatPrice(Number(item.unitPrice) * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">Cliente</h2>
            <div className="mt-5 space-y-3 text-sm text-neutral-700">
              <p>
                <span className="font-medium text-neutral-900">Nombre:</span>{' '}
                {order.customerName}
              </p>
              <p>
                <span className="font-medium text-neutral-900">Email:</span>{' '}
                {order.customerEmail}
              </p>
              <p>
                <span className="font-medium text-neutral-900">Telefono:</span>{' '}
                {order.customerPhone ?? 'No informado'}
              </p>
              <p>
                <span className="font-medium text-neutral-900">Direccion:</span>{' '}
                {order.customerAddress ?? 'No informada'}
              </p>
              <p>
                <span className="font-medium text-neutral-900">Notas:</span>{' '}
                {order.notes ?? 'Sin notas'}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">
              Estado del pedido
            </h2>
            <div className="mt-5 space-y-4 text-sm text-neutral-700">
              <p>
                <span className="font-medium text-neutral-900">Estado actual:</span>{' '}
                {order.status}
              </p>
              <p>
                <span className="font-medium text-neutral-900">Metodo:</span>{' '}
                {order.paymentMethod ?? 'No definido'}
              </p>
              <p>
                <span className="font-medium text-neutral-900">Mercado Pago:</span>{' '}
                {order.mercadopagoStatus ?? 'Sin novedad'}
              </p>
              <p>
                <span className="font-medium text-neutral-900">Referencia:</span>{' '}
                {order.externalReference ?? 'Sin referencia'}
              </p>

              <div className="border-t border-neutral-200 pt-4">
                <OrderStatusForm orderId={order.id} currentStatus={order.status} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">Resumen</h2>
            <div className="mt-5 space-y-3 text-sm text-neutral-700">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Envio</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-200 pt-3 text-base font-semibold text-neutral-900">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
