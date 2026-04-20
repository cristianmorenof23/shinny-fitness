'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updateOrderStatus } from '@/app/actions/order'

const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'PAID', label: 'Pagado' },
  { value: 'CANCELLED', label: 'Cancelado' },
  { value: 'SHIPPED', label: 'Enviado' },
  { value: 'DELIVERED', label: 'Entregado' },
] as const

export function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: 'PENDING' | 'PAID' | 'CANCELLED' | 'SHIPPED' | 'DELIVERED'
}) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    startTransition(async () => {
      const result = await updateOrderStatus({
        orderId,
        status,
      })

      if (!result.ok) {
        toast.error(result.message)
        return
      }

      toast.success('Estado del pedido actualizado.')
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value as
                | 'PENDING'
                | 'PAID'
                | 'CANCELLED'
                | 'SHIPPED'
                | 'DELIVERED'
            )
          }
          className="h-11 flex-1 rounded-xl border border-neutral-300 px-4 text-sm outline-none transition focus:border-neutral-900"
        >
          {ORDER_STATUSES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? 'Guardando...' : 'Guardar estado'}
        </button>
      </div>
    </form>
  )
}
