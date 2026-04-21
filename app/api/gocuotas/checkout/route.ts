import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getGoCuotasConfig } from '@/app/lib/gocuotas'

const goCuotasCheckoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    email: z.email(),
    phone: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
  }),
  paymentMethod: z.literal('gocuotas'),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
        selectedSize: z.string().optional(),
        selectedColor: z.string().optional(),
      })
    )
    .min(1),
})

export async function POST(request: Request) {
  try {
    goCuotasCheckoutSchema.parse(await request.json())

    const config = getGoCuotasConfig()

    if (!config.enabled) {
      return NextResponse.json(
        {
          error:
            'GoCuotas todavia no esta habilitado para esta tienda. Falta configurar el alta comercial y las credenciales reales.',
        },
        { status: 503 }
      )
    }

    if (config.mode === 'payment_link' && config.paymentLinkUrl) {
      return NextResponse.json({
        checkoutUrl: config.paymentLinkUrl,
      })
    }

    return NextResponse.json(
      {
        error:
          'GoCuotas esta configurado en modo custom, pero falta implementar el flujo segun la documentacion del comercio.',
      },
      { status: 501 }
    )
  } catch (error) {
    console.error('Error starting GoCuotas checkout:', error)
    return NextResponse.json(
      {
        error:
          'No pudimos iniciar GoCuotas. Revisa la configuracion del comercio e intenta nuevamente.',
      },
      { status: 500 }
    )
  }
}
