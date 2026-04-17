'use client'

import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import { useCartStore } from '@/app/store/cart-store'

import 'swiper/css'
import 'swiper/css/navigation'

const products = [
  {
    id: 1,
    name: 'Top Motion Nude',
    slug: 'top-motion-nude',
    price: 25990,
    image: 'https://images.unsplash.com/photo-1506629905607-d9d7d4b0b09b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    name: 'Calza Rise Brown',
    slug: 'calza-rise-brown',
    price: 38990,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    name: 'Conjunto Balance Sand',
    slug: 'conjunto-balance-sand',
    price: 54990,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    name: 'Short Energy Mocha',
    slug: 'short-energy-mocha',
    price: 28990,
    image: 'https://images.unsplash.com/photo-1485727749690-d091e8284ef3?auto=format&fit=crop&w=1200&q=80',
  },
]

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export function FeaturedProducts() {
  const addItem = useCartStore((state) => state.addItem)

  return (
    <section className="bg-[#FDFBF9] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header con diseño editorial */}
        <div className="mb-14 flex items-end justify-between">
          <div className="max-w-2xl">
            <span className="mb-3 inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B5E3C]">
              Selección Shiny
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-[#2D241E] sm:text-5xl">
              Nuestros <span className="italic font-serif">Favoritos</span>
            </h2>
          </div>

          <Link
            href="/productos"
            className="group hidden items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#4A3728] transition-all hover:text-[#8B5E3C] md:flex"
          >
            Ver catálogo completo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Slider de Productos */}
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          navigation
          loop
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="featured-products-swiper pb-12!"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <article className="group relative flex h-full flex-col rounded-[2.5rem] border border-[#E5DED4] bg-white p-3 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(74,55,40,0.12)]">
                
                {/* Imagen del Producto */}
                <Link href={`/productos/${product.slug}`} className="relative block aspect-3/4 overflow-hidden rounded-4xl bg-[#F5F0EB]">
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                  
                  {/* Badge de Cuotas */}
                  <div className="absolute left-3 top-3 rounded-2xl bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#4A3728] backdrop-blur-md">
                    3 Cuotas s/interés
                  </div>
                </Link>

                {/* Info del Producto */}
                <div className="flex flex-1 flex-col px-3 pb-4 pt-6">
                  <div className="mb-4 flex-1">
                    <Link
                      href={`/productos/${product.slug}`}
                      className="text-lg font-bold text-[#2D241E] transition-colors hover:text-[#8B5E3C]"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-xl font-bold text-[#4A3728]">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#8B5E3C]">
                      o 3 pagos de <span className="font-bold">{formatPrice(product.price / 3)}</span>
                    </p>
                  </div>

                  {/* Botón de Acción rápida */}
                  <button
                    onClick={() => addItem({ ...product, selectedSize: 'Único', selectedColor: 'Único' })}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#F5F0EB] py-4 text-xs font-bold uppercase tracking-widest text-[#4A3728] transition-all hover:bg-[#4A3728] hover:text-white"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Añadir al carrito
                  </button>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Estilos para las flechas de navegación de Swiper */}
        <style jsx global>{`
          .featured-products-swiper .swiper-button-next,
          .featured-products-swiper .swiper-button-prev {
            width: 50px;
            height: 50px;
            background: white;
            border-radius: 50%;
            color: #4A3728 !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            top: 40%;
          }
          .featured-products-swiper .swiper-button-next::after,
          .featured-products-swiper .swiper-button-prev::after {
            font-size: 18px;
            font-weight: bold;
          }
        `}</style>
      </div>
    </section>
  )
}