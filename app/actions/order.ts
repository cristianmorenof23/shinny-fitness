'use server'

import { requireAdmin } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(['PENDING', 'PAID', 'CANCELLED', 'SHIPPED', 'DELIVERED']),
})

export async function updateOrderStatus(input: {
  orderId: string
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'SHIPPED' | 'DELIVERED'
}) {
  await requireAdmin()

  const parsed = updateOrderStatusSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false,
      message: 'No pudimos validar el nuevo estado del pedido.',
    }
  }

  await prisma.order.update({
    where: {
      id: parsed.data.orderId,
    },
    data: {
      status: parsed.data.status,
    },
  })

  revalidatePath('/admin/pedidos')
  revalidatePath(`/admin/pedidos/${parsed.data.orderId}`)

  return {
    ok: true,
  }
}
