import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/app/lib/prisma'
import {
  getDatabaseCapacityMessage,
  isDatabaseCapacityError,
} from '@/app/lib/database-errors'
import { getGoCuotasConfig } from '@/app/lib/gocuotas'
import { sendOrderAlert } from '@/app/lib/order-alerts'
import { getStorefrontProductsByIds } from '@/app/lib/storefront'

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

function normalizeVariantValue(value?: string) {
  return value && value !== 'Unico' ? value : null
}

export async function POST(request: Request) {
  try {
    const body = goCuotasCheckoutSchema.parse(await request.json())

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

    const productIds = body.items.map((item) => item.productId)
    const products = await getStorefrontProductsByIds(productIds)

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Algunos productos del carrito ya no estan disponibles.' },
        { status: 400 }
      )
    }

    const productMap = new Map(products.map((product) => [product.id, product]))
    const orderItemsData = body.items.map((item) => {
      const product = productMap.get(item.productId)

      if (!product) {
        throw new Error('Producto inexistente en el carrito.')
      }

      const normalizedColor = normalizeVariantValue(item.selectedColor)
      const normalizedSize = normalizeVariantValue(item.selectedSize)
      const hasVariants = product.variants.length > 0

      if (!hasVariants) {
        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: Number(product.price),
          variantId: null as string | null,
        }
      }

      const matchedVariant = product.variants.find(
        (variant) =>
          (variant.color ?? null) === normalizedColor &&
          (variant.size ?? null) === normalizedSize
      )

      if (!matchedVariant) {
        throw new Error(
          `La combinacion elegida para ${product.name} ya no esta disponible.`
        )
      }

      if (matchedVariant.stock < item.quantity) {
        throw new Error(
          `No hay stock suficiente para ${product.name} en la variante elegida.`
        )
      }

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(product.price),
        variantId: matchedVariant.id,
      }
    })

    const subtotal = orderItemsData.reduce((acc, item) => {
      return acc + Number(item.unitPrice) * item.quantity
    }, 0)

    const externalReference = `gocuotas-${randomUUID()}`

    const order = await prisma.order.create({
      data: {
        customerName: body.customer.name,
        customerEmail: body.customer.email,
        customerPhone: body.customer.phone || null,
        customerAddress: body.customer.address || null,
        notes: body.customer.notes || null,
        subtotal,
        total: subtotal,
        paymentMethod: 'gocuotas',
        externalReference,
        items: {
          create: orderItemsData,
        },
      },
    })

    await sendOrderAlert({
      orderId: order.id,
      externalReference,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      total: order.total,
      paymentMethod: order.paymentMethod,
      alertType: 'pending_validation',
      source: 'gocuotas',
    })

    if (config.mode === 'payment_link' && config.paymentLinkUrl) {
      return NextResponse.json({
        checkoutUrl: config.paymentLinkUrl,
        externalReference,
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

    const message =
      isDatabaseCapacityError(error)
        ? getDatabaseCapacityMessage('preparar GoCuotas')
        : error instanceof Error
          ? error.message
          : 'No pudimos iniciar GoCuotas. Revisa la configuracion del comercio e intenta nuevamente.'

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    )
  }
}
