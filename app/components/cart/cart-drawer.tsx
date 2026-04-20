'use client'

import Link from 'next/link'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/app/store/cart-store'

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

type Props = {
  open: boolean
  onClose: () => void
}

function formatVariantLabel(color?: string, size?: string) {
  const parts = [color, size].filter(Boolean)
  return parts.length > 0 ? parts.join(' - ') : 'Sin variante'
}

export function CartDrawer({ open, onClose }: Props) {
  const items = useCartStore((state) => state.items)
  const increase = useCartStore((state) => state.increaseQuantity)
  const decrease = useCartStore((state) => state.decreaseQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const total = useCartStore((state) => state.getTotalPrice())

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#eadfd5] p-5">
          <h2 className="text-lg font-semibold text-[#2f241d]">Tu carrito</h2>

          <button type="button" onClick={onClose}>
            <X className="h-5 w-5 text-[#4b3425]" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {items.length === 0 ? (
            <p className="text-sm text-[#6f5b4d]">Tu carrito esta vacio.</p>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                className="flex gap-4 border-b border-[#f0e6dc] pb-4"
              >
                <div
                  className="h-20 w-20 rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image})` }}
                />

                <div className="flex flex-1 flex-col justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#2f241d]">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#8b684d]">
                      {formatVariantLabel(item.selectedColor, item.selectedSize)}
                    </p>
                    <p className="mt-1 text-sm text-[#6f5b4d]">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          decrease(item.id, item.selectedSize, item.selectedColor)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          increase(item.id, item.selectedSize, item.selectedColor)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        removeItem(item.id, item.selectedSize, item.selectedColor)
                        toast.info(`${item.name} se elimino del carrito.`)
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-[#e4d2c4] px-3 py-2 text-xs font-semibold text-[#7b5a43] transition hover:bg-[#f8efe7]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-[#eadfd5] p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-[#6f5b4d]">Total</span>
            <span className="font-semibold text-[#2f241d]">
              {formatPrice(total)}
            </span>
          </div>

          <Link
            href="/carrito"
            onClick={onClose}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#7b5a43] py-3 text-sm font-medium text-white hover:bg-[#6b4d39]"
          >
            Ir al carrito
          </Link>
        </div>
      </div>
    </>
  )
}
