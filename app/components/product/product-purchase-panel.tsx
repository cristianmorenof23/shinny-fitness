'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useCartStore } from '@/app/store/cart-store'

type ProductVariantOption = {
  id: string
  color: string | null
  size: string | null
  stock: number
}

type ProductPurchasePanelProps = {
  product: {
    id: string
    name: string
    slug: string
    price: number
    image: string
  }
  variants: ProductVariantOption[]
  onColorChange?: (color: string) => void
}

function uniqueValues(values: (string | null)[]) {
  return [...new Set(values.filter(Boolean))] as string[]
}

function getColorSwatchClass(color: string) {
  const normalized = color.trim().toLowerCase()

  if (normalized.includes('negro')) return 'bg-black'
  if (normalized.includes('blanco')) return 'bg-white'
  if (normalized.includes('gris')) return 'bg-zinc-400'
  if (normalized.includes('rosa')) return 'bg-pink-400'
  if (normalized.includes('fucsia')) return 'bg-fuchsia-500'
  if (normalized.includes('rojo')) return 'bg-red-500'
  if (normalized.includes('bordo')) return 'bg-rose-900'
  if (normalized.includes('azul')) return 'bg-blue-500'
  if (normalized.includes('celeste')) return 'bg-sky-400'
  if (normalized.includes('verde')) return 'bg-emerald-500'
  if (normalized.includes('lima')) return 'bg-lime-400'
  if (normalized.includes('amarillo')) return 'bg-yellow-400'
  if (normalized.includes('naranja')) return 'bg-orange-400'
  if (normalized.includes('violeta')) return 'bg-violet-500'
  if (normalized.includes('lila')) return 'bg-purple-300'
  if (normalized.includes('beige')) return 'bg-stone-300'
  if (normalized.includes('crema')) return 'bg-amber-100'
  if (normalized.includes('marron') || normalized.includes('camel')) return 'bg-amber-700'

  return 'bg-[#8B5E3C]'
}

export function ProductPurchasePanel({
  product,
  variants,
  onColorChange,
}: ProductPurchasePanelProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')

  const activeVariants = useMemo(
    () => variants.filter((variant) => variant.stock >= 0),
    [variants]
  )

  const inStockVariants = useMemo(
    () => activeVariants.filter((variant) => variant.stock > 0),
    [activeVariants]
  )

  const colors = useMemo(
    () => uniqueValues(activeVariants.map((variant) => variant.color)),
    [activeVariants]
  )

  const sizesForSelectedColor = useMemo(() => {
    if (colors.length > 0 && !selectedColor) {
      return []
    }

    const scopedVariants = selectedColor
      ? activeVariants.filter((variant) => variant.color === selectedColor)
      : activeVariants

    return uniqueValues(scopedVariants.map((variant) => variant.size))
  }, [activeVariants, colors.length, selectedColor])

  const selectedVariant = useMemo(
    () =>
      activeVariants.find(
        (variant) =>
          (variant.color ?? '') === selectedColor &&
          (variant.size ?? '') === selectedSize
      ),
    [activeVariants, selectedColor, selectedSize]
  )

  const requiresSelection = activeVariants.length > 0
  const hasStock =
    activeVariants.length === 0 || inStockVariants.length > 0
  const canAddToCart =
    activeVariants.length === 0
      ? true
      : Boolean(selectedVariant && selectedVariant.stock > 0)

  return (
    <div className="space-y-5">
      {colors.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5E3C]">
            Color
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = selectedColor === color
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color)
                    setSelectedSize('')
                    onColorChange?.(color)
                  }}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                    isSelected
                      ? 'border-[#4A3728] bg-[#4A3728] text-white'
                      : 'border-[#dccbbc] bg-white text-[#4A3728] hover:bg-[#f8efe7]'
                  }`}
                >
                  <span
                    className={`h-3.5 w-3.5 rounded-full border border-black/10 ${getColorSwatchClass(color)} ${
                      color.trim().toLowerCase().includes('blanco')
                        ? 'shadow-[inset_0_0_0_1px_rgba(45,36,30,0.12)]'
                        : ''
                    }`}
                  />
                  {color}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      {sizesForSelectedColor.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5E3C]">
            Talle
          </p>
          <div className="flex flex-wrap gap-2">
            {sizesForSelectedColor.map((size) => {
              const matchingVariant = activeVariants.find(
                (variant) =>
                  (variant.color ?? '') === (selectedColor || variant.color || '') &&
                  (variant.size ?? '') === size
              )

              const disabled = !matchingVariant || matchingVariant.stock <= 0
              const isSelected = selectedSize === size

              return (
                <button
                  key={size}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    isSelected
                      ? 'border-[#4A3728] bg-[#4A3728] text-white'
                      : 'border-[#dccbbc] bg-white text-[#4A3728] hover:bg-[#f8efe7]'
                  } disabled:cursor-not-allowed disabled:border-[#ece2d8] disabled:bg-[#f5f0eb] disabled:text-[#b79e89]`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      {requiresSelection ? (
        <p className="text-sm text-[#7A6A5F]">
          {colors.length > 0 && !selectedColor
            ? 'Elige primero un color para ver los talles disponibles.'
            : selectedVariant
            ? `Stock disponible para esta combinacion: ${selectedVariant.stock}`
            : 'Elige color y talle para agregar este producto al carrito.'}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={!hasStock || !canAddToCart}
          onClick={() => {
            if (requiresSelection && !selectedVariant) {
              toast.error('Selecciona un color y un talle validos antes de continuar.')
              return
            }

            addItem({
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              image: product.image,
              selectedSize: selectedVariant?.size ?? 'Unico',
              selectedColor: selectedVariant?.color ?? 'Unico',
            })

            toast.success(`${product.name} se agrego al carrito.`)
          }}
          className="inline-flex items-center justify-center rounded-full bg-[#4A3728] px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[#c8b6a6]"
        >
          {!hasStock ? 'Sin stock' : 'Agregar al carrito'}
        </button>

        <Link
          href="/checkout"
          className="inline-flex items-center justify-center rounded-full border border-[#dccbbc] px-6 py-4 text-sm font-semibold text-[#4b3425] transition hover:bg-[#f8efe7]"
        >
          Ir al checkout
        </Link>
      </div>
    </div>
  )
}
