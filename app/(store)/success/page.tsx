import type { Metadata } from 'next'
import Link from 'next/link'
import { ClearCartOnSuccess } from '@/app/components/checkout/clear-cart-on-success'
import { createMetadata } from '@/app/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Compra exitosa',
  description: 'Pantalla de confirmacion de compra de Shiny Fitness.',
  path: '/success',
  noIndex: true,
})

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; external_reference?: string }>
}) {
  const params = await searchParams
  const isApproved = params.status === 'approved'

  return (
    <main className="min-h-[70vh] bg-[#fcf8f4] py-16">
      {isApproved ? <ClearCartOnSuccess /> : null}

      <div className="mx-auto max-w-3xl rounded-[28px] border border-[#eadfd5] bg-white p-10 text-center shadow-[0_10px_30px_rgba(91,67,50,0.05)]">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b684d]">
          {isApproved ? 'Pago aprobado' : 'Estado del pago'}
        </span>

        <h1 className="mt-4 text-3xl font-semibold text-[#2f241d]">
          {isApproved
            ? 'Tu compra ya esta confirmada'
            : 'Recibimos tu pedido y estamos revisando el pago'}
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#6f5b4d]">
          {isApproved
            ? 'Te enviaremos el detalle a tu email y continuaremos con la preparacion del pedido.'
            : 'Si el pago quedo pendiente o en revision, Mercado Pago puede demorar unos minutos en confirmarlo.'}
        </p>

        {params.external_reference ? (
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-[#8b684d]">
            Pedido: {params.external_reference}
          </p>
        ) : null}

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
        </div>
      </div>
    </main>
  )
}
