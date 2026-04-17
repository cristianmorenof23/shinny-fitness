import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const categories = [
  {
    name: 'Tops',
    image:
      'https://images.unsplash.com/photo-1506629905607-d9d7d4b0b09b?auto=format&fit=crop&w=1200&q=80',
    href: '/productos?categoria=tops',
  },
  {
    name: 'Calzas',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    href: '/productos?categoria=calzas',
  },
  {
    name: 'Conjuntos',
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    href: '/productos?categoria=conjuntos',
  },
  {
    name: 'Shorts',
    image:
      'https://images.unsplash.com/photo-1485727749690-d091e8284ef3?auto=format&fit=crop&w=1200&q=80',
    href: '/productos?categoria=shorts',
  },
]

export function FeaturedCategories() {
  return (
    <section className="bg-[#fcf8f4] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b684d]">
            Categorías
          </span>

          <h2 className="mt-3 text-3xl font-semibold text-[#2f241d] sm:text-4xl">
            Elegí por estilo
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative overflow-hidden rounded-[26px]"
            >
              <div className="relative h-85">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
              </div>

              <div className="absolute bottom-0 z-10 w-full p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-white">
                    {cat.name}
                  </h3>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition group-hover:bg-white/30">
                    <ArrowUpRight className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}