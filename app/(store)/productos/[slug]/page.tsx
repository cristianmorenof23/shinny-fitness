'use client'

import { useState } from 'react'
import { useCartStore } from '@/app/store/cart-store'
import { notFound } from 'next/navigation'

type Product = {
  id: number
  name: string
  slug: string
  price: number
  images: string[]
  colors: string[]
  sizes: string[]
  description: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'Top Motion Nude',
    slug: 'top-motion-nude',
    price: 25990,
    images: [
      'https://images.unsplash.com/photo-1506629905607-d9d7d4b0b09b',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
    ],
    colors: ['Beige', 'Negro'],
    sizes: ['S', 'M', 'L'],
    description:
      'Top deportivo diseñado para brindar comodidad, soporte y estilo en cada entrenamiento.',
  },
  {
    id: 2,
    name: 'Calza Rise Brown',
    slug: 'calza-rise-brown',
    price: 38990,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a',
    ],
    colors: ['Marrón', 'Negro'],
    sizes: ['M', 'L'],
    description:
      'Calza de tiro alto con ajuste perfecto para entrenar o usar todos los días.',
  },
]

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value)
}

function getInstallment(value: number) {
  return Math.round(value / 3)
}

// 🎨 mapa de colores visuales
const colorMap: Record<string, string> = {
  Beige: '#d6c3b3',
  Negro: '#111111',
  Marrón: '#7b5a43',
}

export default function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  // 🔥 HOOKS ARRIBA SIEMPRE
  const addItem = useCartStore((state) => state.addItem)

  const product = products.find((p) => p.slug === params.slug)

  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0] || ''
  )
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [error, setError] = useState(false)

  if (!product) return notFound()

  const installment = getInstallment(product.price)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">

        {/* 🖼 IMÁGENES */}
        <div>
          {/* Imagen principal */}
          <div className="h-125 w-full overflow-hidden rounded-3xl bg-[#f6eee7] shadow-[0_20px_40px_rgba(91,67,50,0.10)]">
            <div
              className="h-full w-full bg-cover bg-center transition duration-700 hover:scale-105"
              style={{ backgroundImage: `url(${selectedImage})` }}
            />
          </div>

          {/* Thumbnails */}
          <div className="mt-4 flex gap-3">
            {product.images.map((img) => (
              <button
                key={img}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`h-20 w-20 overflow-hidden rounded-xl border transition ${
                  selectedImage === img
                    ? 'ring-2 ring-[#7b5a43] ring-offset-2'
                    : 'hover:scale-105'
                }`}
              >
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${img})` }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* 📦 INFO */}
        <div className="space-y-6">

          <div className="space-y-3">
            <span className="inline-block rounded-full bg-[#f3e6dc] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#7b5a43]">
              Shiny
            </span>

            <h1 className="text-3xl font-semibold text-[#2f241d]">
              {product.name}
            </h1>

            <p className="text-2xl font-bold text-[#4b3425]">
              {formatPrice(product.price)}
            </p>

            <p className="text-sm text-[#7a6556]">
              3 cuotas sin interés de{' '}
              <span className="font-semibold text-[#6b4f3a]">
                {formatPrice(installment)}
              </span>
            </p>

            <p className="max-w-xl text-sm leading-relaxed text-[#6f5b4d]">
              {product.description}
            </p>
          </div>

          {/* 👕 TALLES */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-[#2f241d]">
              Talle
            </h3>

            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size)
                    setError(false)
                  }}
                  className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                    selectedSize === size
                      ? 'border-[#7b5a43] bg-[#7b5a43] text-white'
                      : 'border-[#e0d1c4] text-[#4b3425] hover:bg-[#f3e6dc]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 🎨 COLORES */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-[#2f241d]">
              Color
            </h3>

            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color)
                    setError(false)
                  }}
                  title={color}
                  className={`h-9 w-9 rounded-full border transition-all duration-300 ${
                    selectedColor === color
                      ? 'scale-110 ring-2 ring-[#7b5a43] ring-offset-2'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: colorMap[color] ?? '#ccc',
                  }}
                />
              ))}
            </div>

            {selectedColor && (
              <p className="mt-2 text-sm text-[#6f5b4d]">
                Color seleccionado:{' '}
                <span className="font-medium">{selectedColor}</span>
              </p>
            )}
          </div>

          {/* ⚠️ ERROR */}
          {error && (
            <p className="text-sm font-medium text-red-500">
              Seleccioná talle y color
            </p>
          )}

          {/* 🛒 BOTÓN */}
          <button
            type="button"
            onClick={() => {
              if (!selectedSize || !selectedColor) {
                setError(true)
                return
              }

              addItem({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: selectedImage || product.images[0],
                selectedSize,
                selectedColor,
              })
            }}
            className="w-full rounded-full bg-[#7b5a43] py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#6b4d39] active:scale-[0.98]"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
}