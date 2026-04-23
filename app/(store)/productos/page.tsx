import Link from 'next/link'
import { StorefrontProductCard } from '@/app/components/product/storefront-product-card'
import { StorefrontFilters } from '@/app/components/product/storefront-filters'
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
              <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
                {products.map((product) => {
                  const imageUrl = product.images[0]?.url || '/placeholder-product.jpg'

                  return (
                    <StorefrontProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: Number(product.price),
                        shortDescription: product.shortDescription,
                        categoryName: product.category.name,
                        image: imageUrl,
                      }}
                      images={product.images.map((image) => ({
                        id: image.id,
                        url: image.url,
                        alt: image.alt,
                      }))}
                      variants={product.variants.map((variant) => ({
                        id: variant.id,
                        color: variant.color,
                        size: variant.size,
                        stock: variant.stock,
                      }))}
                    />
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
