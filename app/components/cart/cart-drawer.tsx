'use client'

import { useCartStore } from '@/app/store/cart-store'
import { X, Minus, Plus } from 'lucide-react'

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

export function CartDrawer({ open, onClose }: Props) {
  const items = useCartStore((state) => state.items)
  const increase = useCartStore((state) => state.increaseQuantity)
  const decrease = useCartStore((state) => state.decreaseQuantity)
  const total = useCartStore((state) => state.getTotalPrice())

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#eadfd5] p-5">
          <h2 className="text-lg font-semibold text-[#2f241d]">
            Tu carrito
          </h2>

          <button onClick={onClose}>
            <X className="h-5 w-5 text-[#4b3425]" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {items.length === 0 ? (
            <p className="text-sm text-[#6f5b4d]">
              Tu carrito está vacío
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border-b border-[#f0e6dc] pb-4"
              >
                <div
                  className="h-20 w-20 rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image})` }}
                />

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#2f241d]">
                      {item.name}
                    </p>
                    <p className="text-sm text-[#6f5b4d]">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() =>decrease(item.id, item.selectedSize, item.selectedColor)}>
                      <Minus className="h-4 w-4" />
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => increase(item.id, item.selectedSize, item.selectedColor)
}>
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#eadfd5] p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-[#6f5b4d]">Total</span>
            <span className="font-semibold text-[#2f241d]">
              {formatPrice(total)}
            </span>
          </div>

          <button className="w-full rounded-full bg-[#7b5a43] py-3 text-sm font-medium text-white hover:bg-[#6b4d39]">
            Ir al carrito
          </button>
        </div>
      </div>
    </>
  )
}