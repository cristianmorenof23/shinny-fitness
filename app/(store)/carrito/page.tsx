'use client'

import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/app/store/cart-store'

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const increaseQuantity = useCartStore((state) => state.increaseQuantity)
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity)
  const clearCart = useCartStore((state) => state.clearCart)
  const totalPrice = useCartStore((state) => state.getTotalPrice())

  return (
    <main className="min-h-[70vh] bg-[#fcf8f4] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b684d]">
            Tu carrito
          </span>

          <h1 className="mt-3 text-3xl font-semibold text-[#2f241d] sm:text-4xl">
            Revisá tus productos antes de continuar
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[28px] border border-[#eadfd5] bg-white p-10 text-center shadow-[0_10px_30px_rgba(91,67,50,0.05)]">
            <h2 className="text-2xl font-semibold text-[#2f241d]">
              Tu carrito está vacío
            </h2>
            <p className="mt-3 text-sm text-[#6f5b4d]">
              Agregá algunos productos para empezar tu compra.
            </p>

            <Link
              href="/productos"
              className="mt-6 inline-flex rounded-full bg-[#7b5a43] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#6b4d39]"
            >
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-4 rounded-3xl border border-[#eadfd5] bg-white p-5 shadow-[0_10px_30px_rgba(91,67,50,0.05)] sm:flex-row"
                >
                  <div
                    className="h-32 w-full rounded-[20px] bg-cover bg-center sm:w-32"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />

                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-[#2f241d]">
                        {item.name}
                      </h2>
                      <p className="mt-1 text-sm text-[#6f5b4d]">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center rounded-full border border-[#ddccbd]">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(item.id, item.selectedSize, item.selectedColor)
                          } className="p-3 text-[#4b3425] transition hover:bg-[#f3e6dc]"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span className="min-w-10 text-center text-sm font-medium text-[#2f241d]">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(item.id, item.selectedSize, item.selectedColor)
                          } className="p-3 text-[#4b3425] transition hover:bg-[#f3e6dc]"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.id, item.selectedSize, item.selectedColor)
                        } className="inline-flex items-center gap-2 rounded-full border border-[#e4d2c4] px-4 py-2 text-sm font-medium text-[#7b5a43] transition hover:bg-[#f8efe7]"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-[28px] border border-[#eadfd5] bg-white p-6 shadow-[0_10px_30px_rgba(91,67,50,0.05)]">
              <h3 className="text-xl font-semibold text-[#2f241d]">
                Resumen de compra
              </h3>

              <div className="mt-6 space-y-4 text-sm text-[#6f5b4d]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#2f241d]">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Envío</span>
                  <span className="font-medium text-[#2f241d]">A calcular</span>
                </div>

                <div className="border-t border-[#eadfd5] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-[#2f241d]">
                      Total
                    </span>
                    <span className="text-base font-semibold text-[#2f241d]">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#7b5a43] px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#6b4d39]"
              >
                Continuar compra
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-[#dccbbc] px-5 py-3 text-sm font-medium text-[#4b3425] transition hover:bg-[#f8efe7]"
              >
                Vaciar carrito
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}