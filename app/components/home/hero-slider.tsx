'use client'

import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const slides = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=80',
    eyebrow: 'Nueva selección',
    title: 'Ropa deportiva que acompaña tu ritmo',
    description:
      'Descubrí prendas seleccionadas para entrenar, moverte con comodidad y verte increíble todos los días.',
    primaryButton: 'Ver catálogo',
    primaryHref: '/productos',
    secondaryButton: 'Explorar destacados',
    secondaryHref: '/productos?destacados=true',
    align: 'left',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1506629905607-d9d7d4b0b09b?auto=format&fit=crop&w=1800&q=80',
    eyebrow: 'Shiny',
    title: 'Conjuntos, tops y calzas con estilo premium',
    description:
      'Una selección pensada para mujeres que quieren sentirse seguras, cómodas y cancheras dentro y fuera del entrenamiento.',
    primaryButton: 'Comprar ahora',
    primaryHref: '/productos',
    secondaryButton: 'Ver novedades',
    secondaryHref: '/productos?nuevos=true',
    align: 'center',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1800&q=80',
    eyebrow: 'Elegí tu look',
    title: 'Prendas elegidas para que te sientas bien con vos',
    description:
      'Desde básicos versátiles hasta conjuntos protagonistas. Encontrá ese look que te haga sentir cómoda, segura y lista para todo.',
    primaryButton: 'Ir al catálogo',
    primaryHref: '/productos',
    secondaryButton: 'Contactanos',
    secondaryHref: '/contacto',
    align: 'left',
  },
]

function getContentAlignment(align: 'left' | 'center') {
  if (align === 'center') {
    return 'items-center text-center'
  }

  return 'items-start text-left'
}

export function HeroSlider() {
  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        slidesPerView={1}
        loop
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={900}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation
        className="hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[72vh] min-h-140 w-full overflow-hidden md:h-[82vh]">
              <div
                className="absolute inset-0 scale-[1.03] bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />

              <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/35 to-black/20" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.28),rgba(0,0,0,0.08))]" />

              <div className="relative z-10 mx-auto flex h-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                  className={`flex max-w-2xl flex-col justify-center gap-5 ${getContentAlignment(
                    slide.align as 'left' | 'center'
                  )}`}
                >
                  <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f6e8dc] backdrop-blur-sm sm:text-xs">
                    {slide.eyebrow}
                  </span>

                  <h1 className="max-w-[14ch] text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>

                  <p className="max-w-xl text-sm leading-7 text-[#f5ebe3] sm:text-base">
                    {slide.description}
                  </p>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <Link
                      href={slide.primaryHref}
                      className="inline-flex items-center justify-center rounded-full bg-[#7b5a43] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#6b4d39]"
                    >
                      {slide.primaryButton}
                    </Link>

                    <Link
                      href={slide.secondaryHref}
                      className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
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
    </section>
  )
}