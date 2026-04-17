'use client'

import Link from 'next/link'
import { useCartStore } from '@/app/store/cart-store'

type Product = {
  id: number
  name: string
  slug: string
  price: number
  image: string
  color: string
  size: string[]
}

type Filters = {
  color: string | null
  sizes: string[]
  price: number
}

const products: Product[] = [
  {
    id: 1,
    name: 'Top Motion Nude',
    slug: 'top-motion-nude',
    price: 25990,
    image: 'https://images.unsplash.com/photo-1506629905607-d9d7d4b0b09b',
    color: 'Beige',
    size: ['S', 'M'],
  },
  {
    id: 2,
    name: 'Calza Rise Brown',
    slug: 'calza-rise-brown',
    price: 38990,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
    color: 'Marrón',
    size: ['M', 'L'],
  },
  {
    id: 3,
    name: 'Conjunto Balance Sand',
    slug: 'conjunto-balance-sand',
    price: 54990,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a',
    color: 'Beige',
    size: ['S', 'M', 'L'],
  },
  {
    id: 4,
    name: 'Short Energy Black',
    slug: 'short-energy-black',
    price: 28990,
    image: 'https://images.unsplash.com/photo-1485727749690-d091e8284ef3',
    color: 'Negro',
    size: ['XS', 'S'],
  },
]

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value)
}

function getInstallment(value: number, quantity = 3) {
  return Math.round(value / quantity)
}

export function ProductsGrid({ filters }: { filters: Filters }) {
  const addItem = useCartStore((state) => state.addItem)

  const filtered = products.filter((p) => {
    const colorMatch = !filters.color || p.color === filters.color
    const sizeMatch =
      filters.sizes.length === 0 ||
      filters.sizes.some((s) => p.size.includes(s))
    const priceMatch = p.price <= filters.price

    return colorMatch && sizeMatch && priceMatch
  })

  return (
    <div>
      <p className="mb-4 text-sm text-[#6f5b4d]">
        {filtered.length} productos
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => {
          const installment = getInstallment(product.price)

          return (
            <article
              key={product.id}
              className="group relative overflow-hidden rounded-2xl border border-[#eadfd5] bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(91,67,50,0.15)]"
            >
              {/* Imagen */}
              <Link href={`/productos/${product.slug}`} className="block">
                <div className="relative h-60 overflow-hidden bg-[#f6eee7]">
                  
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />

                  {/* Overlay hover */}
                  <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />

                  {/* Badge */}
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#6b4f3a] shadow-sm backdrop-blur">
                    3 cuotas sin interés
                  </div>

                  {/* Botón rápido hover */}
                  <div className="absolute bottom-3 left-1/2 z-10 w-[80%] -translate-x-1/2 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Link
                      href={`/productos/${product.slug}`}
                      className="block w-full rounded-full bg-white py-2 text-center text-sm font-medium text-[#4b3425] shadow"
                    >
                      Ver producto
                    </Link>
                  </div>
                </div>
              </Link>

              {/* Info */}
              <div className="space-y-2 p-4">
                <Link
                  href={`/productos/${product.slug}`}
                  className="block text-sm font-medium text-[#2f241d] transition hover:text-[#8b684d]"
                >
                  {product.name}
                </Link>

                <p className="text-lg font-semibold text-[#4b3425]">
                  {formatPrice(product.price)}
                </p>

                <p className="text-xs text-[#7a6556]">
                  3 cuotas de {formatPrice(installment)}
                </p>

                <button
                  onClick={() => addItem({
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    image: product.image,
                    selectedSize: product.size[0],
                    selectedColor: product.color,
                  })}
                  className="mt-2 w-full rounded-full bg-[#7b5a43] py-2 text-sm text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#6b4d39] active:scale-[0.98]"
                >
                  Agregar al carrito
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}