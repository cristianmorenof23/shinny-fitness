import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/app/lib/prisma'
import {
  getDatabaseCapacityMessage,
  isDatabaseCapacityError,
} from '@/app/lib/database-errors'
import { getMercadoPagoPreferenceClient } from '@/app/lib/mercadopago'
import { siteConfig } from '@/app/lib/seo'
import { getStorefrontProductsByIds } from '@/app/lib/storefront'

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

function normalizeVariantValue(value?: string) {
  return value && value !== 'Unico' ? value : null
}

function resolveReturnOrigin(origin: string) {
  return origin.includes('localhost') || origin.includes('127.0.0.1')
    ? siteConfig.url
    : origin
}

export async function POST(request: Request) {
  try {
    const body = checkoutSchema.parse(await request.json())
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

    const externalReference = `order-${randomUUID()}`

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
        externalReference,
        items: {
          create: orderItemsData,
        },
      },
    })

    const origin = new URL(request.url).origin
    const returnOrigin = resolveReturnOrigin(origin)
    const backUrls = {
      success: `${returnOrigin}/success?status=approved&external_reference=${externalReference}`,
      failure: `${returnOrigin}/success?status=failure&external_reference=${externalReference}`,
      pending: `${returnOrigin}/success?status=pending&external_reference=${externalReference}`,
    }
    const preferenceClient = getMercadoPagoPreferenceClient()
    const preference = await preferenceClient.create({
      body: {
        external_reference: externalReference,
        notification_url: `${returnOrigin}/api/webhook/mercadopago`,
        back_urls: backUrls,
        auto_return: 'approved',
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

    return NextResponse.json({
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      orderId: order.id,
    })
  } catch (error) {
    console.error('Error creating Mercado Pago preference:', error)

    const message =
      isDatabaseCapacityError(error)
        ? getDatabaseCapacityMessage('preparar el checkout')
        : error instanceof Error
          ? error.message
          : 'No pudimos iniciar Mercado Pago. Revisa MERCADOPAGO_ACCESS_TOKEN y vuelve a intentar.'

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    )
  }
}
