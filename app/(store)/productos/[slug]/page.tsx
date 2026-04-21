import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ProductDetailView } from '@/app/components/product/product-detail-view'
import { formatArs, getInstallmentPrice } from '@/app/lib/pricing'
import { createMetadata, siteConfig, truncateDescription } from '@/app/lib/seo'
import { getStorefrontProductBySlug } from '@/app/lib/storefront'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  try {
    const product = await getStorefrontProductBySlug(slug)

    if (!product) {
      return createMetadata({
        title: 'Producto no encontrado',
        description:
          'No encontramos el producto que intentaste visitar en Shiny Fitness.',
        path: `/productos/${slug}`,
        noIndex: true,
      })
    }

    return createMetadata({
      title: product.name,
      description: truncateDescription(
        product.shortDescription ??
          product.description ??
          `Descubri ${product.name} en Shiny Fitness.`
      ),
      path: `/productos/${product.slug}`,
      image: product.images[0]?.url,
      keywords: [product.name, product.category.name, ...siteConfig.keywords],
    })
  } catch {
    return createMetadata({
      title: 'Producto',
      description:
        'Descubri este producto de Shiny Fitness y explora ropa deportiva femenina online.',
      path: `/productos/${slug}`,
      noIndex: true,
    })
  }
}

function formatVariantLabel(color?: string | null, size?: string | null) {
  const parts = [color, size].filter(Boolean)
  return parts.length > 0 ? parts.join(' - ') : 'Variante unica'
}

export default async function ProductoSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const product = await getStorefrontProductBySlug(slug)

  if (!product || !product.isActive) {
    notFound()
  }

  const mainImage = product.images[0]?.url || '/placeholder-product.jpg'
  const hasStock =
    product.variants.length === 0 ||
    product.variants.some((variant) => variant.stock > 0)

  return (
    <main className="min-h-screen bg-[#FDFBF9]">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-2 lg:px-8">
        <ProductDetailView
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: Number(product.price),
            image: mainImage,
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

        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E3C]">
            {product.category.name}
          </p>

          <h1 className="text-3xl font-bold text-[#4A3728] lg:text-4xl">
            {product.name}
          </h1>

          <div className="space-y-2">
            <p className="text-2xl font-bold text-[#4A3728]">
              {formatArs(product.price)}
            </p>
            <p className="text-sm text-[#8B5E3C]">
              3 cuotas sin interes de{' '}
              <span className="font-semibold">
                {formatArs(getInstallmentPrice(product.price))}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-[#7A6A5F]">
            <span className="rounded-full bg-[#f5ede6] px-3 py-1">
              {hasStock ? 'Disponible' : 'Sin stock'}
            </span>
            <span className="rounded-full bg-[#f5ede6] px-3 py-1">
              3 cuotas sin interes
            </span>
          </div>

          {product.shortDescription ? (
            <p className="text-base text-[#7A6A5F]">{product.shortDescription}</p>
          ) : null}

          <div className="rounded-2xl border border-[#E5DED4] bg-white p-5">
            <h2 className="mb-2 text-lg font-semibold text-[#4A3728]">
              Descripcion
            </h2>
            <p className="mb-4 text-sm font-medium text-[#8B5E3C]">
              Podes pagar en 3 cuotas sin interes. El valor por cuota se calcula
              automaticamente segun el monto del producto.
            </p>
            <p className="whitespace-pre-line text-sm leading-7 text-[#6B5B50]">
              {product.description}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5DED4] bg-white p-5">
            <h2 className="mb-3 text-lg font-semibold text-[#4A3728]">
              Variantes disponibles
            </h2>

            {product.variants.length === 0 ? (
              <p className="text-sm text-[#7A6A5F]">
                Este producto se vende como variante unica.
              </p>
            ) : (
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between rounded-xl border border-[#E5DED4] px-4 py-3"
                  >
                    <div className="text-sm text-[#4A3728]">
                      {formatVariantLabel(variant.color, variant.size)}
                    </div>
                    <span className="text-sm font-medium text-[#8B5E3C]">
                      Stock: {variant.stock}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
