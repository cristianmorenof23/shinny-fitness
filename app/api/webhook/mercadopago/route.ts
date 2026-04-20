import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { getMercadoPagoPaymentClient } from '@/app/lib/mercadopago'

function mapMercadoPagoStatusToOrderStatus(status?: string) {
  switch (status) {
    case 'approved':
      return 'PAID' as const
    case 'cancelled':
    case 'rejected':
      return 'CANCELLED' as const
    default:
      return 'PENDING' as const
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      action?: string
      type?: string
      data?: { id?: string }
    }

    if (payload.type !== 'payment' || !payload.data?.id) {
      return NextResponse.json({ ok: true })
    }

    const paymentClient = getMercadoPagoPaymentClient()
    const payment = await paymentClient.get({
      id: payload.data.id,
    })

    const externalReference =
      payment.external_reference || payment.metadata?.external_reference

    if (!externalReference) {
      return NextResponse.json({ ok: true })
    }

    await prisma.order.updateMany({
      where: {
        externalReference,
      },
      data: {
        mercadopagoStatus: payment.status ?? payload.action ?? 'updated',
        mercadopagoId: String(payment.id),
        status: mapMercadoPagoStatusToOrderStatus(payment.status),
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error processing Mercado Pago webhook:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
