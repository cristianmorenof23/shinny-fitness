import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/app/lib/prisma'
import { getMercadoPagoPreferenceClient } from '@/app/lib/mercadopago'

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    email: z.email(),
    phone: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
  }),
  paymentMethod: z.literal('mercadopago'),
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
    const body = checkoutSchema.parse(await request.json())
    const productIds = body.items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
        isActive: true,
      },
      include: {
        variants: {
          where: {
            isActive: true,
          },
        },
      },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Algunos productos del carrito ya no estan disponibles.' },
        { status: 400 }
      )
    }

    const productMap = new Map(products.map((product) => [product.id, product]))
    const subtotal = body.items.reduce((acc, item) => {
      const product = productMap.get(item.productId)
      return acc + Number(product?.price ?? 0) * item.quantity
    }, 0)

    const order = await prisma.order.create({
      data: {
        customerName: body.customer.name,
        customerEmail: body.customer.email,
        customerPhone: body.customer.phone || null,
        customerAddress: body.customer.address || null,
        notes: body.customer.notes || null,
        subtotal,
        total: subtotal,
        paymentMethod: 'mercadopago',
        items: {
          create: body.items.map((item) => {
            const product = productMap.get(item.productId)
            return {
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: Number(product?.price ?? 0),
            }
          }),
        },
      },
    })

    const externalReference = `order-${order.id}`

    await prisma.order.update({
      where: { id: order.id },
      data: {
        externalReference,
      },
    })

    const origin = new URL(request.url).origin
    const isLocalEnvironment =
      origin.includes('localhost') || origin.includes('127.0.0.1')
    const backUrls = {
      success: `${origin}/success?status=approved&external_reference=${externalReference}`,
      failure: `${origin}/success?status=failure&external_reference=${externalReference}`,
      pending: `${origin}/success?status=pending&external_reference=${externalReference}`,
    }
    const preferenceClient = getMercadoPagoPreferenceClient()
    const preference = await preferenceClient.create({
      body: {
        external_reference: externalReference,
        notification_url: `${origin}/api/webhook/mercadopago`,
        back_urls: backUrls,
        auto_return: isLocalEnvironment ? undefined : 'approved',
        payer: {
          name: body.customer.name,
          email: body.customer.email,
        },
        items: body.items.map((item) => {
          const product = productMap.get(item.productId)
          return {
            id: item.productId,
            title: product?.name ?? 'Producto Shiny Fitness',
            quantity: item.quantity,
            currency_id: 'ARS',
            unit_price: Number(product?.price ?? 0),
          }
        }),
      },
    })

    await prisma.order.update({
      where: { id: order.id },
      data: {
        mercadopagoId: preference.id ?? null,
        mercadopagoStatus: 'created',
      },
    })

    return NextResponse.json({
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      orderId: order.id,
    })
  } catch (error) {
    console.error('Error creating Mercado Pago preference:', error)

    return NextResponse.json(
      {
        error:
          'No pudimos iniciar Mercado Pago. Revisa MERCADOPAGO_ACCESS_TOKEN y vuelve a intentar.',
      },
      { status: 500 }
    )
  }
}
