import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const categories = [
  {
    name: 'Tops',
    image: 'https://images.unsplash.com/photo-1506629905607-d9d7d4b0b09b?auto=format&fit=crop&w=1200&q=80',
    href: '/productos?categoria=tops',
  },
  {
    name: 'Calzas',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    href: '/productos?categoria=calzas',
  },
  {
    name: 'Conjuntos',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    href: '/productos?categoria=conjuntos',
  },
  {
    name: 'Shorts',
    image: 'https://images.unsplash.com/photo-1485727749690-d091e8284ef3?auto=format&fit=crop&w=1200&q=80',
    href: '/productos?categoria=shorts',
  },
]

export function FeaturedCategories() {
  return (
    <section className="bg-[#FDFBF9] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera de Sección */}
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B5E3C]">
            Explorá nuestra
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-[#2D241E] sm:text-5xl">
            Elegí tu <span className="italic font-serif">estilo</span>
          </h2>
          <div className="mt-4 h-1 w-12 rounded-full bg-[#E5DED4]"></div>
        </div>

        {/* Grid de Categorías */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative h-112.5 overflow-hidden rounded-[3rem] bg-[#F5F0EB]"
            >
              {/* Imagen con zoom suave y filtro cálido */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                style={{ backgroundImage: `url(${cat.image})` }}
              />

              {/* Overlay con gradiente marrón chocolate (no negro) */}
              <div className="absolute inset-0 bg-linear-to-t from-[#2D241E]/70 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />

              {/* Contenido de la Card */}
              <div className="absolute bottom-0 z-10 w-full p-6">
                <div className="flex items-center justify-between rounded-4xl border border-white/20 bg-white/10 p-4 backdrop-blur-md transition-all duration-500 group-hover:bg-white/20 group-hover:px-6">
                  <h3 className="text-xl font-bold tracking-wide text-white">
                    {cat.name}
                  </h3>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8B5E3C] text-white transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Efecto de brillo al pasar el mouse */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-linear-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}