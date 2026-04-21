import Image from 'next/image'
import Link from 'next/link'
import { ProductCardPurchase } from '@/app/components/product/product-card-purchase'
import { StorefrontFilters } from '@/app/components/product/storefront-filters'
import { formatArs, getInstallmentPrice } from '@/app/lib/pricing'
import {
  getStorefrontFilterOptions,
  getStorefrontProducts,
} from '@/app/lib/storefront'

function getActiveFiltersCount(filters: {
  search?: string
  categoria?: string
  color?: string
  talle?: string
}) {
  return Object.values(filters).filter(Boolean).length
}

type ProductsPageParams = {
  search?: string
  categoria?: string
  color?: string
  talle?: string
}

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<ProductsPageParams>
}) {
  const params = await searchParams
  const [products, filterOptions] = await Promise.all([
    getStorefrontProducts({
      search: params.search,
      categorySlug: params.categoria,
      color: params.color,
      size: params.talle,
    }),
    getStorefrontFilterOptions(),
  ])

  const activeFiltersCount = getActiveFiltersCount(params)

  return (
    <main className="min-h-screen bg-[#FDFBF9]">
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="mb-8 flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-[#4A3728]">Productos</h1>
          <p className="text-sm text-[#7A6A5F]">
            Descubri nuestra coleccion de ropa deportiva femenina.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[290px_minmax(0,1fr)]">
          <StorefrontFilters
            key={`${params.search ?? ''}-${params.categoria ?? ''}-${params.color ?? ''}-${params.talle ?? ''}`}
            categories={filterOptions.categories}
            colors={filterOptions.colors}
            sizes={filterOptions.sizes}
            current={params}
          />

          <div className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#4A3728]">
                  {products.length} productos
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#8B5E3C]">
                  {activeFiltersCount > 0
                    ? `${activeFiltersCount} filtros aplicados`
                    : 'Catalogo completo'}
                </p>
              </div>

              {activeFiltersCount > 0 ? (
                <Link
                  href="/productos"
                  className="inline-flex items-center justify-center rounded-full border border-[#dccbbc] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#4b3425] transition hover:bg-[#f8efe7]"
                >
                  Limpiar filtros
                </Link>
              ) : null}
            </div>

            {products.length === 0 ? (
              <div className="rounded-2xl border border-[#E5DED4] bg-white p-10 text-center">
                <h2 className="text-xl font-semibold text-[#4A3728]">
                  No encontramos productos para esta vista
                </h2>
                <p className="mt-2 text-sm text-[#7A6A5F]">
                  {activeFiltersCount > 0
                    ? 'Prueba quitando filtros o cambiando la busqueda.'
                    : 'Todavia no se cargaron productos activos en la tienda.'}
                </p>
                {activeFiltersCount > 0 ? (
                  <Link
                    href="/productos"
                    className="mt-6 inline-flex rounded-full bg-[#4A3728] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Ver todo el catalogo
                  </Link>
                ) : null}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => {
                  const imageUrl = product.images[0]?.url || '/placeholder-product.jpg'
                  const colors = [
                    ...new Set(
                      product.variants
                        .filter((variant) => variant.stock > 0)
                        .map((variant) => variant.color)
                        .filter(Boolean)
                    ),
                  ]
                  const sizes = [
                    ...new Set(
                      product.variants
                        .filter((variant) => variant.stock > 0)
                        .map((variant) => variant.size)
                        .filter(Boolean)
                    ),
                  ]

                  return (
                    <article
                      key={product.id}
                      className="group overflow-hidden rounded-2xl border border-[#E5DED4] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <Link href={`/productos/${product.slug}`} className="block">
                        <div className="relative aspect-4/5 bg-[#F6F1EB]">
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover transition duration-300 group-hover:scale-[1.03]"
                          />

                          <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2">
                            {colors.length > 1 ? (
                              <span className="rounded-full bg-white/92 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#4A3728] shadow-sm">
                                {colors.length} colores
                              </span>
                            ) : null}
                            {sizes.length > 1 ? (
                              <span className="rounded-full bg-[#2D241E]/88 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-sm">
                                {sizes.length} talles
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </Link>

                      <div className="space-y-3 p-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#8B5E3C]">
                          {product.category.name}
                        </p>

                        <Link href={`/productos/${product.slug}`}>
                          <h2 className="line-clamp-2 text-base font-semibold text-[#4A3728]">
                            {product.name}
                          </h2>
                        </Link>

                        {product.shortDescription ? (
                          <p className="line-clamp-2 text-sm text-[#7A6A5F]">
                            {product.shortDescription}
                          </p>
                        ) : null}

                        <div className="space-y-1">
                          <p className="text-lg font-bold text-[#4A3728]">
                            {formatArs(product.price)}
                          </p>
                          <p className="text-xs text-[#8B5E3C]">
                            3 cuotas sin interes de{' '}
                            <span className="font-semibold">
                              {formatArs(getInstallmentPrice(product.price))}
                            </span>
                          </p>
                        </div>

                        <ProductCardPurchase
                          product={{
                            id: product.id,
                            name: product.name,
                            slug: product.slug,
                            price: Number(product.price),
                            image: imageUrl,
                          }}
                          variants={product.variants.map((variant) => ({
                            id: variant.id,
                            color: variant.color,
                            size: variant.size,
                            stock: variant.stock,
                          }))}
                        />
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
