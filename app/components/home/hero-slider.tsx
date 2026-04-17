'use client'

import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules'
import { ArrowRight } from 'lucide-react'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=80',
    eyebrow: 'Nueva selección',
    title: 'Ropa deportiva que acompaña tu ritmo',
    description: 'Descubrí prendas seleccionadas para entrenar, moverte con comodidad y verte increíble todos los días.',
    primaryButton: 'Ver catálogo',
    primaryHref: '/productos',
    secondaryButton: 'Destacados',
    secondaryHref: '/productos?destacados=true',
    align: 'left',
  },
  {
    id: 2,
    image: '/banner_2.png',
    eyebrow: 'Shiny Premium',
    title: 'Conjuntos con estilo y actitud',
    description: 'Una selección pensada para mujeres que quieren sentirse seguras y cancheras dentro y fuera del gym.',
    primaryButton: 'Comprar ahora',
    primaryHref: '/productos',
    secondaryButton: 'Ver novedades',
    secondaryHref: '/productos?nuevos=true',
    align: 'center',
  },
]

export function HeroSlider() {
  return (
    <section className="relative group">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        slidesPerView={1}
        loop
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1200}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        className="hero-swiper h-[75vh] md:h-[85vh]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full overflow-hidden">
              {/* Imagen con zoom suave */}
              <div
                className="absolute inset-0 scale-[1.05] bg-cover bg-center transition-transform duration-8000 group-hover:scale-110"
                style={{ backgroundImage: `url(${slide.image})` }}
              />

              {/* Overlay Marrón (No negro) */}
              <div className="absolute inset-0 bg-linear-to-r from-[#2D241E]/80 via-[#2D241E]/40 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-t from-[#2D241E]/50 to-transparent" />

              <div className="relative z-10 mx-auto flex h-full max-w-7xl px-6 lg:px-8">
                <div
                  className={`flex max-w-2xl flex-col justify-center gap-6 ${
                    slide.align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'
                  }`}
                >
                  <span className="inline-flex rounded-full border border-white/30 bg-[#8B5E3C]/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-white backdrop-blur-md">
                    {slide.eyebrow}
                  </span>

                  <h1 className="text-4xl font-bold leading-[1.1] text-white sm:text-6xl lg:text-7xl">
                    {slide.title}
                  </h1>

                  <p className="max-w-lg text-base leading-relaxed text-stone-200 md:text-lg">
                    {slide.description}
                  </p>

                  <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                    <Link
                      href={slide.primaryHref}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8B5E3C] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-[#4A3728] hover:shadow-lg hover:shadow-[#8B5E3C]/30"
                    >
                      {slide.primaryButton}
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      href={slide.secondaryHref}
                      className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/20"
                    >
                      {slide.secondaryButton}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Estilos para customizar los controles de Swiper */}
      <style jsx global>{`
        .hero-swiper .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5;
          width: 12px;
          height: 12px;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #8B5E3C !important;
          width: 30px;
          border-radius: 6px;
          transition: width 0.3s;
        }
        .hero-swiper .swiper-button-next, 
        .hero-swiper .swiper-button-prev {
          color: white !important;
          transform: scale(0.7);
          transition: all 0.3s;
          opacity: 0;
        }
        .group:hover .swiper-button-next, 
        .group:hover .swiper-button-prev {
          opacity: 0.7;
        }
        .swiper-button-next:hover, 
        .swiper-button-prev:hover {
          opacity: 1 !important;
          color: #8B5E3C !important;
        }
      `}</style>
    </section>
  )
}