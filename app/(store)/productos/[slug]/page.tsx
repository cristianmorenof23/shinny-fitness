import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/app/lib/prisma'
import { AddToCartButton } from '@/app/components/product/add-to-cart-button'
import { createMetadata, siteConfig, truncateDescription } from '@/app/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
        category: true,
      },
    })

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

export default async function ProductoSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { createdAt: 'asc' },
      },
      category: true,
      variants: {
        where: {
          isActive: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  if (!product || !product.isActive) {
    notFound()
  }

  const mainImage = product.images[0]?.url || '/placeholder-product.jpg'
  const firstVariant = product.variants[0]
  const hasStock =
    product.variants.length === 0 ||
    product.variants.some((variant) => variant.stock > 0)

  return (
    <main className="min-h-screen bg-[#FDFBF9]">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-2 lg:px-8">
        <div className="space-y-4">
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-white">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {product.images.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-white"
                >
                  <Image
                    src={image.url}
                    alt={image.alt || product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E3C]">
            {product.category.name}
          </p>

          <h1 className="text-3xl font-bold text-[#4A3728] lg:text-4xl">
            {product.name}
          </h1>

          <p className="text-2xl font-bold text-[#4A3728]">
            ${Number(product.price).toLocaleString('es-AR')}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-[#7A6A5F]">
            <span className="rounded-full bg-[#f5ede6] px-3 py-1">
              3 cuotas de $
              {Math.round(Number(product.price) / 3).toLocaleString('es-AR')}
            </span>
            <span className="rounded-full bg-[#f5ede6] px-3 py-1">
              {hasStock ? 'Disponible' : 'Sin stock'}
            </span>
          </div>

          {product.shortDescription ? (
            <p className="text-base text-[#7A6A5F]">{product.shortDescription}</p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
                image: mainImage,
                selectedSize: firstVariant?.size ?? 'Unico',
                selectedColor: firstVariant?.color ?? 'Unico',
              }}
              disabled={!hasStock}
              className="inline-flex items-center justify-center rounded-full bg-[#4A3728] px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[#c8b6a6]"
              label={hasStock ? 'Agregar al carrito' : 'Sin stock'}
            />

            <Link
              href="/checkout"
              className="inline-flex items-center justify-center rounded-full border border-[#dccbbc] px-6 py-4 text-sm font-semibold text-[#4b3425] transition hover:bg-[#f8efe7]"
            >
              Ir al checkout
            </Link>
          </div>

          <div className="rounded-2xl border border-[#E5DED4] bg-white p-5">
            <h2 className="mb-2 text-lg font-semibold text-[#4A3728]">
              Descripcion
            </h2>
            <p className="whitespace-pre-line text-sm leading-7 text-[#6B5B50]">
              {product.description}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5DED4] bg-white p-5">
            <h2 className="mb-3 text-lg font-semibold text-[#4A3728]">
              Variantes
            </h2>

            {product.variants.length === 0 ? (
              <p className="text-sm text-[#7A6A5F]">
                Este producto todavia no tiene variantes cargadas.
              </p>
            ) : (
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between rounded-xl border border-[#E5DED4] px-4 py-3"
                  >
                    <div className="text-sm text-[#4A3728]">
                      {variant.color ? <span>Color: {variant.color} </span> : null}
                      {variant.size ? <span>· Talle: {variant.size}</span> : null}
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
