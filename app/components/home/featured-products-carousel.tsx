'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import { AddToCartButton } from '@/app/components/product/add-to-cart-button'

import 'swiper/css'
import 'swiper/css/navigation'

type FeaturedProduct = {
  id: string
  name: string
  slug: string
  price: number | { toString(): string }
  category: {
    name: string
  }
  images: {
    url: string
  }[]
  variants: {
    stock: number
    size: string | null
    color: string | null
  }[]
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export function FeaturedProductsCarousel({
  products,
}: {
  products: FeaturedProduct[]
}) {
  return (
    <section className="bg-[#FDFBF9] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex items-end justify-between">
          <div className="max-w-2xl">
            <span className="mb-3 inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B5E3C]">
              Seleccion Shiny
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-[#2D241E] sm:text-5xl">
              Nuestros <span className="italic font-serif">Favoritos</span>
            </h2>
          </div>

          <Link
            href="/productos"
            className="group hidden items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#4A3728] transition-all hover:text-[#8B5E3C] md:flex"
          >
            Ver catalogo completo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          navigation
          loop={products.length > 4}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            640: { slidesPerView: Math.min(products.length, 2.2) },
            1024: { slidesPerView: Math.min(products.length, 3) },
            1280: { slidesPerView: Math.min(products.length, 4) },
          }}
          className="featured-products-swiper pb-12!"
        >
          {products.map((product) => {
            const image = product.images[0]?.url || '/placeholder-product.jpg'
            const firstVariant = product.variants[0]
            const hasStock =
              product.variants.length === 0 ||
              product.variants.some((variant) => variant.stock > 0)

            return (
              <SwiperSlide key={product.id}>
                <article className="group relative flex h-full flex-col rounded-[2.5rem] border border-[#E5DED4] bg-white p-3 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(74,55,40,0.12)]">
                  <Link
                    href={`/productos/${product.slug}`}
                    className="relative block aspect-3/4 overflow-hidden rounded-4xl bg-[#F5F0EB]"
                  >
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />

                    <div className="absolute left-3 top-3 rounded-2xl bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#4A3728] backdrop-blur-md">
                      3 Cuotas s/interes
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col px-3 pb-4 pt-6">
                    <div className="mb-4 flex-1">
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#8B5E3C]">
                        {product.category.name}
                      </p>

                      <Link
                        href={`/productos/${product.slug}`}
                        className="text-lg font-bold text-[#2D241E] transition-colors hover:text-[#8B5E3C]"
                      >
                        {product.name}
                      </Link>

                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-xl font-bold text-[#4A3728]">
                          {formatPrice(Number(product.price))}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-[#8B5E3C]">
                        o 3 pagos de{' '}
                        <span className="font-bold">
                          {formatPrice(Number(product.price) / 3)}
                        </span>
                      </p>
                    </div>

                    <AddToCartButton
                      product={{
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: Number(product.price),
                        image,
                        selectedSize: firstVariant?.size ?? 'Unico',
                        selectedColor: firstVariant?.color ?? 'Unico',
                      }}
                      className="flex w-full items-center justify-center rounded-2xl bg-[#F5F0EB] py-4 text-xs font-bold uppercase tracking-widest text-[#4A3728] transition-all hover:bg-[#4A3728] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={!hasStock}
                      label={hasStock ? 'Anadir al carrito' : 'Sin stock'}
                    />
                  </div>
                </article>
              </SwiperSlide>
            )
          })}
        </Swiper>

        <style jsx global>{`
          .featured-products-swiper .swiper-button-next,
          .featured-products-swiper .swiper-button-prev {
            width: 50px;
            height: 50px;
            background: white;
            border-radius: 50%;
            color: #4a3728 !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
