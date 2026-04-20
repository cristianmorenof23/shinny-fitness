import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getStorefrontCategories } from '@/app/lib/storefront'

export async function FeaturedCategories() {
  const categories = await getStorefrontCategories(4)

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="bg-[#FDFBF9] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B5E3C]">
            Explora nuestra
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-[#2D241E] sm:text-5xl">
            Elegi tu <span className="italic font-serif">estilo</span>
          </h2>
          <div className="mt-4 h-1 w-12 rounded-full bg-[#E5DED4]" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/productos?categoria=${category.slug}`}
              className="group relative h-112.5 overflow-hidden rounded-[3rem] bg-[#F5F0EB]"
            >
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#d9c6b2,_#8b684d_55%,_#2d241e)] transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1" />
              )}

              <div className="absolute inset-0 bg-linear-to-t from-[#2D241E]/70 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />

              <div className="absolute bottom-0 z-10 w-full p-6">
                <div className="flex items-center justify-between rounded-4xl border border-white/20 bg-white/10 p-4 backdrop-blur-md transition-all duration-500 group-hover:bg-white/20 group-hover:px-6">
                  <div>
                    <h3 className="text-xl font-bold tracking-wide text-white">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/80">
                      {category._count.products} productos
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8B5E3C] text-white transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
