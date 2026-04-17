'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import { useCartStore } from '@/app/store/cart-store'

const products = [
  {
    id: 1,
    name: 'Top Motion Nude',
    slug: 'top-motion-nude',
    price: 25990,
    image:
      'https://images.unsplash.com/photo-1506629905607-d9d7d4b0b09b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    name: 'Calza Rise Brown',
    slug: 'calza-rise-brown',
    price: 38990,
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    name: 'Conjunto Balance Sand',
    slug: 'conjunto-balance-sand',
    price: 54990,
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    name: 'Short Energy Mocha',
    slug: 'short-energy-mocha',
    price: 28990,
    image:
      'https://images.unsplash.com/photo-1485727749690-d091e8284ef3?auto=format&fit=crop&w=1200&q=80',
  },

  {
    id: 4,
    name: 'Short Energy Mocha',
    slug: 'short-energy-mocha',
    price: 28990,
    image:
      'https://images.unsplash.com/photo-1485727749690-d091e8284ef3?auto=format&fit=crop&w=1200&q=80',
  },

  {
    id: 4,
    name: 'Short Energy Mocha',
    slug: 'short-energy-mocha',
    price: 28990,
    image:
      'https://images.unsplash.com/photo-1485727749690-d091e8284ef3?auto=format&fit=crop&w=1200&q=80',
  },

  {
    id: 4,
    name: 'Short Energy Mocha',
    slug: 'short-energy-mocha',
    price: 28990,
    image:
      'https://images.unsplash.com/photo-1485727749690-d091e8284ef3?auto=format&fit=crop&w=1200&q=80',
  },
]

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

function getInstallment(value: number, quantity = 3) {
  return Math.round(value / quantity)
}

export function FeaturedProducts() {
  const addItem = useCartStore((state) => state.addItem)

  return (
    <section className="bg-[#fffaf6] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b684d]">
              Destacados
            </span>

            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#2f241d] sm:text-4xl">
              Prendas elegidas para combinar comodidad, estilo y actitud
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#6f5b4d] sm:text-base">
              Descubrí algunos de los productos más buscados de Shiny y encontrá
              tu próximo look favorito.
            </p>
          </div>

          <Link
            href="/productos"
            className="hidden rounded-full border border-[#d8c5b5] px-5 py-3 text-sm font-medium text-[#4b3425] transition-all duration-300 hover:bg-[#f3e6dc] md:inline-flex"
          >
            Ver todos
          </Link>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          navigation
          loop
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {products.map((product) => {
            const installment = getInstallment(product.price, 3)

            return (
              <SwiperSlide key={product.id}>
                <article className="group overflow-hidden rounded-[26px] border border-[#eadfd5] bg-white shadow-[0_10px_30px_rgba(91,67,50,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(91,67,50,0.12)]">

                  {/* Imagen */}
                  <Link href={`/productos/${product.slug}`} className="block">
                    <div className="relative h-90 overflow-hidden bg-[#f6eee7]">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${product.image})` }}
                      />

                      <div className="absolute left-4 top-4 rounded-full bg-[#fffaf6]/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b4f3a] shadow-sm backdrop-blur-sm">
                        3 cuotas sin interés
                      </div>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="space-y-4 p-5">
                    <div className="space-y-2">
                      <Link
                        href={`/productos/${product.slug}`}
                        className="block text-lg font-semibold leading-snug text-[#2f241d] transition duration-300 hover:text-[#8b684d]"
                      >
                        {product.name}
                      </Link>

                      <p className="text-2xl font-semibold text-[#4b3425]">
                        {formatPrice(product.price)}
                      </p>

                      <p className="text-sm text-[#7a6556]">
                        3 cuotas sin interés de{' '}
                        <span className="font-semibold text-[#6b4f3a]">
                          {formatPrice(installment)}
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => addItem(product)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7b5a43] px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.01] hover:bg-[#6b4d39]"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Agregar al carrito
                    </button>
                  </div>
                </article>
              </SwiperSlide>
            )
          })}
        </Swiper>

        {/* Mobile botón */}
        <div className="mt-8 md:hidden">
          <Link
            href="/productos"
            className="inline-flex rounded-full border border-[#d8c5b5] px-5 py-3 text-sm font-medium text-[#4b3425] transition-all duration-300 hover:bg-[#f3e6dc]"
          >
            Ver todos
          </Link>
        </div>
      </div>
    </section>
  )
}