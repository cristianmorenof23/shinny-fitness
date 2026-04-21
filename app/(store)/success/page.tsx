import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { ClearCartOnSuccess } from '@/app/components/checkout/clear-cart-on-success'
import { buildWhatsAppUrl } from '@/app/lib/contact'
import { getTransferSavingsAmount, transferConfig } from '@/app/lib/payments'
import { prisma } from '@/app/lib/prisma'
import { formatArs } from '@/app/lib/pricing'
import { createMetadata } from '@/app/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Compra exitosa',
  description: 'Pantalla de confirmacion de compra de Shiny Fitness.',
  path: '/success',
  noIndex: true,
})

function getStatusCopy(status?: string) {
  switch (status) {
    case 'approved':
      return {
        eyebrow: 'Pago aprobado',
        title: 'Tu compra ya esta confirmada',
        description:
          'Te enviaremos el detalle a tu email y continuaremos con la preparacion del pedido.',
        accentClass: 'bg-[#eef6f1] text-[#46705a]',
      }
    case 'failure':
    case 'rejected':
      return {
        eyebrow: 'Pago rechazado',
        title: 'No pudimos confirmar el pago',
        description:
          'Tu pedido no se proceso. Puedes volver a intentarlo o elegir otro medio de pago.',
        accentClass: 'bg-[#fff1ef] text-[#a14c3b]',
      }
    default:
      return {
        eyebrow: 'Pago pendiente',
        title: 'Recibimos tu pedido y estamos revisando el pago',
        description:
          'Si el pago quedo pendiente o en revision, Mercado Pago puede demorar unos minutos en confirmarlo.',
        accentClass: 'bg-[#f7efe8] text-[#8b684d]',
      }
  }
}

function formatVariantLabel(color?: string | null, size?: string | null) {
  const parts = [color, size].filter(Boolean)
  return parts.length > 0 ? parts.join(' - ') : 'Variante unica'
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string
    external_reference?: string
    payment_method?: string
  }>
}) {
  const params = await searchParams
  const isApproved = params.status === 'approved'
  const statusCopy = getStatusCopy(params.status)

  const order = params.external_reference
    ? await prisma.order
        .findUnique({
          where: {
            externalReference: params.external_reference,
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
        .catch((error) => {
          console.error('Error loading order on success page:', error)
          return null
        })
    : null
  const paymentMethod = order?.paymentMethod ?? params.payment_method ?? null
  const isTransfer = paymentMethod === 'transferencia'
  const isGoCuotas = paymentMethod === 'gocuotas'

  return (
    <main className="min-h-[70vh] bg-[#fcf8f4] py-16">
      {isApproved ? <ClearCartOnSuccess /> : null}

      <div className="mx-auto max-w-4xl rounded-[28px] border border-[#eadfd5] bg-white p-8 shadow-[0_10px_30px_rgba(91,67,50,0.05)] sm:p-10">
        <div className="text-center">
          <span
            className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${statusCopy.accentClass}`}
          >
            {statusCopy.eyebrow}
          </span>

          <h1 className="mt-5 text-3xl font-semibold text-[#2f241d] sm:text-4xl">
            {statusCopy.title}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6f5b4d]">
            {statusCopy.description}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-[#eadfd5] bg-[#fffaf6] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b684d]">
              Referencia
            </p>
            <p className="mt-2 break-words text-sm font-medium text-[#2f241d]">
              {params.external_reference ?? 'Se generara al confirmar el pago'}
            </p>
          </div>

          <div className="rounded-3xl border border-[#eadfd5] bg-[#fffaf6] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b684d]">
              Estado
            </p>
            <p className="mt-2 text-sm font-medium text-[#2f241d]">
              {order?.status ?? (isApproved ? 'PAID' : 'PENDING')}
            </p>
          </div>

          <div className="rounded-3xl border border-[#eadfd5] bg-[#fffaf6] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b684d]">
              Total
            </p>
            <p className="mt-2 text-sm font-medium text-[#2f241d]">
              {order ? formatArs(order.total) : 'Te lo enviaremos por email'}
            </p>
          </div>
        </div>

        {order ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-[#eadfd5] p-6">
              <h2 className="text-lg font-semibold text-[#2f241d]">
                Resumen del pedido
              </h2>

              <div className="mt-5 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 border-b border-[#f0e6dc] pb-4 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#2f241d]">
                        {item.product.name}
                      </p>
                      <p className="mt-1 text-xs text-[#6f5b4d]">
                        {formatVariantLabel(
                          item.variant?.color ?? null,
                          item.variant?.size ?? null
                        )}{' '}
                        - x{item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-[#2f241d]">
                      {formatArs(Number(item.unitPrice) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#eadfd5] p-6">
              <h2 className="text-lg font-semibold text-[#2f241d]">
                Datos de contacto
              </h2>

              <div className="mt-5 space-y-4 text-sm text-[#6f5b4d]">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b684d]">
                    Cliente
                  </p>
                  <p className="mt-1 text-[#2f241d]">{order.customerName}</p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b684d]">
                    Email
                  </p>
                  <p className="mt-1 text-[#2f241d]">{order.customerEmail}</p>
                </div>

                {order.customerPhone ? (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b684d]">
                      Telefono
                    </p>
                    <p className="mt-1 text-[#2f241d]">{order.customerPhone}</p>
                  </div>
                ) : null}

                {order.customerAddress ? (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b684d]">
                      Entrega
                    </p>
                    <p className="mt-1 text-[#2f241d]">{order.customerAddress}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {isTransfer && order ? (
          <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Transferencia bancaria
            </p>
            <h2 className="mt-3 text-xl font-semibold text-[#2f241d]">
              Completa el pago con descuento
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#4b3425]">
              Te reservamos el {transferConfig.discountPercentage}% OFF pagando al alias{' '}
              <span className="font-semibold">{transferConfig.alias}</span>. El total con descuento
              para este pedido es{' '}
              <span className="font-semibold">{formatArs(order.total)}</span> y
              ahorras{' '}
              <span className="font-semibold">
                {formatArs(getTransferSavingsAmount(order.subtotal))}
              </span>.
            </p>
            <p className="mt-3 text-sm leading-7 text-[#4b3425]">
              Una vez hecha la transferencia, envianos el comprobante por WhatsApp
              para confirmar el pago y coordinar el envio.
            </p>
            <Link
              href={buildWhatsAppUrl(
                `Hola Shiny Fitness, ya hice la transferencia de mi pedido ${order.externalReference ?? order.id} al alias ${transferConfig.alias}. Quiero enviar el comprobante y coordinar el envio.`
              )}
              target="_blank"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#4A3728] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2d241e]"
            >
              <MessageCircle className="h-4 w-4" />
              Enviar comprobante por WhatsApp
            </Link>
          </div>
        ) : null}

        {isGoCuotas && order ? (
          <div className="mt-8 rounded-3xl border border-[#eadfd5] bg-[#fffaf6] p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b684d]">
              GoCuotas
            </p>
            <h2 className="mt-3 text-xl font-semibold text-[#2f241d]">
              Tu pedido quedo registrado para pago externo
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#4b3425]">
              Registramos tu pedido con referencia{' '}
              <span className="font-semibold">
                {order.externalReference ?? order.id}
              </span>{' '}
              y quedo pendiente hasta validar la operacion realizada en
              GoCuotas.
            </p>
            <p className="mt-3 text-sm leading-7 text-[#4b3425]">
              Si necesitas ayuda para confirmar el pago o coordinar el envio,
              puedes escribirnos por WhatsApp y te acompanamos.
            </p>
            <Link
              href={buildWhatsAppUrl(
                `Hola Shiny Fitness, inicie un pago con GoCuotas para mi pedido ${order.externalReference ?? order.id} y quiero confirmar el estado.`
              )}
              target="_blank"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#4A3728] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2d241e]"
            >
              <MessageCircle className="h-4 w-4" />
              Consultar pago por WhatsApp
            </Link>
          </div>
        ) : null}

        <div className="mt-8 rounded-3xl border border-dashed border-[#dccbbc] bg-[#fffaf6] p-5 text-center">
          <p className="text-sm text-[#6f5b4d]">
            Si no vuelves automaticamente despues del pago, tambien puedes regresar
            manualmente y revisar el estado de tu compra desde esta pantalla.
          </p>
          {order ? (
            <Link
              href={buildWhatsAppUrl(
                `Hola Shiny Fitness, ya hice mi compra${order.externalReference ? ` (${order.externalReference})` : ''} y queria consultar el seguimiento y el envio.`
              )}
              target="_blank"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-[#dccbbc] px-5 py-3 text-sm font-medium text-[#4b3425] transition hover:bg-[#f8efe7]"
            >
              <MessageCircle className="h-4 w-4" />
              Consultar por WhatsApp
            </Link>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/productos"
            className="inline-flex items-center justify-center rounded-full bg-[#7b5a43] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#6b4d39]"
          >
            Seguir comprando
          </Link>

          <Link
            href="/cuenta"
            className="inline-flex items-center justify-center rounded-full border border-[#dccbbc] px-6 py-3 text-sm font-medium text-[#4b3425] transition hover:bg-[#f8efe7]"
          >
            Ir a mi cuenta
          </Link>

          <Link
            href="/admin/pedidos"
            className="inline-flex items-center justify-center rounded-full border border-[#dccbbc] px-6 py-3 text-sm font-medium text-[#4b3425] transition hover:bg-[#f8efe7]"
          >
            Ver pedidos en admin
          </Link>
        </div>
      </div>
    </main>
  )
}
