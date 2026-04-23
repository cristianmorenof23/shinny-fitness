'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { BadgePercent, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { formatArs } from '@/app/lib/pricing'
import { getTransferDiscountAmount, transferConfig } from '@/app/lib/payments'
import { useCartStore } from '@/app/store/cart-store'

type ProductCardVariant = {
  id: string
  color: string | null
  size: string | null
  stock: number
}

type ProductCardPurchaseProps = {
  product: {
    id: string
    name: string
    slug: string
    price: number
    image: string
  }
  variants: ProductCardVariant[]
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

export function ProductCardPurchase({
  product,
  variants,
  onColorChange,
}: ProductCardPurchaseProps) {
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

  const sizes = useMemo(
    () => uniqueValues(activeVariants.map((variant) => variant.size)),
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

  const hasVariants = activeVariants.length > 0
  const hasStock = !hasVariants || inStockVariants.length > 0
  const canAddToCart = !hasVariants || Boolean(selectedVariant && selectedVariant.stock > 0)

  const colorsSummary =
    colors.length > 1
      ? `${colors.length} colores disponibles`
      : colors.length === 1
        ? `Color disponible: ${colors[0]}`
        : 'Color unico'

  const sizesSummary =
    sizes.length > 1
      ? `${sizes.length} talles disponibles`
      : sizes.length === 1
        ? `Talle disponible: ${sizes[0]}`
        : 'Talle unico'

  return (
    <div className="space-y-3">
      {hasVariants ? (
        <>
          <div className="space-y-2 rounded-2xl bg-[#fcf8f4] p-2.5 sm:p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8B5E3C] sm:text-[11px] sm:tracking-[0.18em]">
              {colorsSummary}
            </p>
            {colors.length > 0 ? (
              <>
                <select
                  value={selectedColor}
                  onChange={(event) => {
                    const nextColor = event.target.value
                    setSelectedColor(nextColor)
                    setSelectedSize('')
                    onColorChange?.(nextColor)
                  }}
                  className="h-9 w-full rounded-xl border border-[#dccbbc] bg-white px-3 text-[11px] font-medium text-[#4A3728] outline-none transition focus:border-[#4A3728] sm:hidden"
                >
                  <option value="">Elegir color</option>
                  {colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>

                <div className="hidden flex-wrap gap-2 sm:flex">
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
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${
                          isSelected
                            ? 'border-[#4A3728] bg-[#4A3728] text-white'
                            : 'border-[#dccbbc] bg-white text-[#4A3728] hover:bg-[#f8efe7]'
                        }`}
                      >
                        <span
                          className={`h-3 w-3 rounded-full border border-black/10 ${getColorSwatchClass(color)} ${
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
              </>
            ) : null}
          </div>

          <div className="space-y-2 rounded-2xl bg-[#fcf8f4] p-2.5 sm:p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8B5E3C] sm:text-[11px] sm:tracking-[0.18em]">
              {sizesSummary}
            </p>
            {sizesForSelectedColor.length > 0 ? (
              <>
                <select
                  value={selectedSize}
                  onChange={(event) => setSelectedSize(event.target.value)}
                  disabled={sizesForSelectedColor.length === 0}
                  className="h-9 w-full rounded-xl border border-[#dccbbc] bg-white px-3 text-[11px] font-medium text-[#4A3728] outline-none transition focus:border-[#4A3728] disabled:cursor-not-allowed disabled:bg-[#f5f0eb] sm:hidden"
                >
                  <option value="">Elegir talle</option>
                  {sizesForSelectedColor.map((size) => {
                    const matchingVariant = activeVariants.find(
                      (variant) =>
                        (variant.color ?? '') ===
                          (selectedColor || variant.color || '') &&
                        (variant.size ?? '') === size
                    )

                    const disabled = !matchingVariant || matchingVariant.stock <= 0

                    return (
                      <option key={size} value={size} disabled={disabled}>
                        {size}
                      </option>
                    )
                  })}
                </select>

                <div className="hidden flex-wrap gap-2 sm:flex">
                  {sizesForSelectedColor.map((size) => {
                    const matchingVariant = activeVariants.find(
                      (variant) =>
                        (variant.color ?? '') ===
                          (selectedColor || variant.color || '') &&
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
                        className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${
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
              </>
            ) : (
              <p className="text-[11px] leading-5 text-[#7A6A5F] sm:text-xs">
                {colors.length > 0 && !selectedColor
                  ? 'Elegi un color para ver los talles disponibles.'
                  : 'No hay talles disponibles para este color.'}
              </p>
            )}
          </div>
        </>
      ) : null}

      {hasVariants ? (
        <p className="text-[11px] leading-5 text-[#7A6A5F] sm:text-xs">
          {selectedVariant
            ? `Stock para esta combinacion: ${selectedVariant.stock}`
            : 'Selecciona color y talle antes de agregar al carrito.'}
        </p>
      ) : null}

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] leading-5 text-emerald-900 sm:text-xs">
        <p className="inline-flex items-center gap-2 font-semibold uppercase tracking-[0.15em] text-emerald-700">
          <BadgePercent className="h-3.5 w-3.5" />
          {transferConfig.discountPercentage}% off por transferencia
        </p>
        <p className="mt-1">
          Te queda en{' '}
          <span className="font-semibold">
            {formatArs(getTransferDiscountAmount(product.price))}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled={!hasStock || !canAddToCart}
          onClick={() => {
            if (hasVariants && !selectedVariant) {
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
          className="flex w-full items-center justify-center rounded-full bg-[#4A3728] px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[#c8b6a6] sm:px-4 sm:py-3 sm:text-xs sm:tracking-[0.2em]"
        >
          <span className="inline-flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            {!hasStock ? 'Sin stock' : 'Agregar al carrito'}
          </span>
        </button>

        <Link
          href={`/productos/${product.slug}`}
          className="flex w-full items-center justify-center rounded-full border border-[#dccbbc] px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#4A3728] transition hover:bg-[#f8efe7] sm:px-4 sm:py-3 sm:text-xs sm:tracking-[0.2em]"
        >
          Ver detalle
        </Link>
      </div>
    </div>
  )
}
