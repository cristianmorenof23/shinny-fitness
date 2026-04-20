import Image from 'next/image'
import Link from 'next/link'
import { AddToCartButton } from '@/app/components/product/add-to-cart-button'
import {
  getStorefrontFilterOptions,
  getStorefrontProducts,
} from '@/app/lib/storefront'

function buildProductsPath(filters: {
  search?: string
  categoria?: string
  color?: string
  talle?: string
  destacados?: string
  nuevos?: string
}) {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value)
    }
  })

  const query = params.toString()
  return query ? `/productos?${query}` : '/productos'
}

function getActiveFiltersCount(filters: {
  search?: string
  categoria?: string
  color?: string
  talle?: string
  destacados?: string
  nuevos?: string
}) {
  return Object.values(filters).filter(Boolean).length
}

type ProductsPageParams = {
  search?: string
  categoria?: string
  color?: string
  talle?: string
  destacados?: string
  nuevos?: string
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
      featured: params.destacados === 'true',
      isNew: params.nuevos === 'true',
    }),
    getStorefrontFilterOptions(),
  ])

  const activeFiltersCount = getActiveFiltersCount(params)

  return (
    <main className="min-h-screen bg-[#FDFBF9]">
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#4A3728]">Productos</h1>
              <p className="mt-2 text-sm text-[#7A6A5F]">
                Descubri nuestra coleccion de ropa deportiva femenina.
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

          <div className="grid gap-3 rounded-[28px] border border-[#E5DED4] bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-6">
            <form action="/productos" className="xl:col-span-2">
              <input
                type="text"
                name="search"
                defaultValue={params.search ?? ''}
                placeholder="Buscar productos"
                className="h-11 w-full rounded-full border border-[#E5DED4] bg-[#FDFBF9] px-4 text-sm text-[#2D241E] outline-none transition focus:border-[#8B5E3C]"
              />
              {params.categoria ? (
                <input type="hidden" name="categoria" value={params.categoria} />
              ) : null}
              {params.color ? (
                <input type="hidden" name="color" value={params.color} />
              ) : null}
              {params.talle ? (
                <input type="hidden" name="talle" value={params.talle} />
              ) : null}
              {params.destacados ? (
                <input type="hidden" name="destacados" value={params.destacados} />
              ) : null}
              {params.nuevos ? (
                <input type="hidden" name="nuevos" value={params.nuevos} />
              ) : null}
            </form>

            <div className="xl:col-span-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5E3C]">
                  Categoria
                </label>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={buildProductsPath({
                      ...params,
                      categoria: undefined,
                    })}
                    className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                      !params.categoria
                        ? 'bg-[#4A3728] text-white'
                        : 'bg-[#f5ede6] text-[#4b3425] hover:bg-[#eadfd5]'
                    }`}
                  >
                    Todas
                  </Link>
                  {filterOptions.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={buildProductsPath({
                        ...params,
                        categoria: category.slug,
                      })}
                      className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                        params.categoria === category.slug
                          ? 'bg-[#4A3728] text-white'
                          : 'bg-[#f5ede6] text-[#4b3425] hover:bg-[#eadfd5]'
                      }`}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5E3C]">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={buildProductsPath({
                      ...params,
                      color: undefined,
                    })}
                    className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                      !params.color
                        ? 'bg-[#4A3728] text-white'
                        : 'bg-[#f5ede6] text-[#4b3425] hover:bg-[#eadfd5]'
                    }`}
                  >
                    Todos
                  </Link>
                  {filterOptions.colors.map((color) => (
                    <Link
                      key={color}
                      href={buildProductsPath({
                        ...params,
                        color,
                      })}
                      className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                        params.color === color
                          ? 'bg-[#4A3728] text-white'
                          : 'bg-[#f5ede6] text-[#4b3425] hover:bg-[#eadfd5]'
                      }`}
                    >
                      {color}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5E3C]">
                  Talle
                </label>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={buildProductsPath({
                      ...params,
                      talle: undefined,
                    })}
                    className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                      !params.talle
                        ? 'bg-[#4A3728] text-white'
                        : 'bg-[#f5ede6] text-[#4b3425] hover:bg-[#eadfd5]'
                    }`}
                  >
                    Todos
                  </Link>
                  {filterOptions.sizes.map((size) => (
                    <Link
                      key={size}
                      href={buildProductsPath({
                        ...params,
                        talle: size,
                      })}
                      className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                        params.talle === size
                          ? 'bg-[#4A3728] text-white'
                          : 'bg-[#f5ede6] text-[#4b3425] hover:bg-[#eadfd5]'
                      }`}
                    >
                      {size}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5E3C]">
                  Destacados
                </label>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={buildProductsPath({
                      ...params,
                      destacados: undefined,
                    })}
                    className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                      params.destacados !== 'true'
                        ? 'bg-[#4A3728] text-white'
                        : 'bg-[#f5ede6] text-[#4b3425] hover:bg-[#eadfd5]'
                    }`}
                  >
                    Todos
                  </Link>
                  <Link
                    href={buildProductsPath({
                      ...params,
                      destacados: 'true',
                    })}
                    className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                      params.destacados === 'true'
                        ? 'bg-[#4A3728] text-white'
                        : 'bg-[#f5ede6] text-[#4b3425] hover:bg-[#eadfd5]'
                    }`}
                  >
                    Destacados
                  </Link>
                  <Link
                    href={buildProductsPath({
                      ...params,
                      nuevos: 'true',
                    })}
                    className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                      params.nuevos === 'true'
                        ? 'bg-[#4A3728] text-white'
                        : 'bg-[#f5ede6] text-[#4b3425] hover:bg-[#eadfd5]'
                    }`}
                  >
                    Nuevos
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {activeFiltersCount > 0 ? (
            <div className="flex flex-wrap gap-2 text-xs font-medium text-[#8B5E3C]">
              {params.search ? (
                <span className="rounded-full bg-[#f5ede6] px-3 py-1">
                  Busqueda: {params.search}
                </span>
              ) : null}
              {params.categoria ? (
                <span className="rounded-full bg-[#f5ede6] px-3 py-1">
                  Categoria: {params.categoria}
                </span>
              ) : null}
              {params.color ? (
                <span className="rounded-full bg-[#f5ede6] px-3 py-1">
                  Color: {params.color}
                </span>
              ) : null}
              {params.talle ? (
                <span className="rounded-full bg-[#f5ede6] px-3 py-1">
                  Talle: {params.talle}
                </span>
              ) : null}
              {params.destacados === 'true' ? (
                <span className="rounded-full bg-[#f5ede6] px-3 py-1">
                  Destacados
                </span>
              ) : null}
              {params.nuevos === 'true' ? (
                <span className="rounded-full bg-[#f5ede6] px-3 py-1">Nuevos</span>
              ) : null}
            </div>
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const imageUrl = product.images[0]?.url || '/placeholder-product.jpg'
              const firstVariant = product.variants[0]
              const hasStock =
                product.variants.length === 0 ||
                product.variants.some((variant) => variant.stock > 0)

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
                    </div>
                  </Link>

                  <div className="space-y-2 p-4">
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

                    {firstVariant ? (
                      <p className="text-xs text-[#7A6A5F]">
                        {firstVariant.color ? `Color: ${firstVariant.color}` : 'Color unico'}
                        {' · '}
                        {firstVariant.size ? `Talle: ${firstVariant.size}` : 'Talle unico'}
                      </p>
                    ) : null}

                    <p className="pt-1 text-lg font-bold text-[#4A3728]">
                      ${Number(product.price).toLocaleString('es-AR')}
                    </p>

                    <AddToCartButton
                      product={{
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: Number(product.price),
                        image: imageUrl,
                        selectedSize: firstVariant?.size ?? 'Unico',
                        selectedColor: firstVariant?.color ?? 'Unico',
                      }}
                      disabled={!hasStock}
                      className="flex w-full items-center justify-center rounded-full bg-[#4A3728] px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[#c8b6a6]"
                      label={hasStock ? 'Agregar al carrito' : 'Sin stock'}
                    />
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
