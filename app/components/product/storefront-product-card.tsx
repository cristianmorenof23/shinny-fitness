'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ProductCardPurchase } from '@/app/components/product/product-card-purchase'
import { ProductShareButton } from '@/app/components/product/product-share-button'
import {
  parseProductImageAlt,
  sortImagesByColor,
} from '@/app/lib/product-images'
import { formatArs, getInstallmentPrice } from '@/app/lib/pricing'

type StorefrontProductImage = {
  id: string
  url: string
  alt: string | null
}

type StorefrontProductVariant = {
  id: string
  color: string | null
  size: string | null
  stock: number
}

type StorefrontProductCardProps = {
  product: {
    id: string
    name: string
    slug: string
    price: number
    shortDescription?: string | null
    categoryName: string
    image: string
  }
  images: StorefrontProductImage[]
  variants: StorefrontProductVariant[]
}

export function StorefrontProductCard({
  product,
  images,
  variants,
}: StorefrontProductCardProps) {
  const [selectedColor, setSelectedColor] = useState('')

  const allImages = useMemo(
    () =>
      images.length > 0
        ? images
        : [
            {
              id: 'fallback',
              url: product.image,
              alt: product.name,
            },
          ],
    [images, product.image, product.name]
  )

  const orderedImages = useMemo(
    () => sortImagesByColor(allImages, selectedColor),
    [allImages, selectedColor]
  )

  const primaryImage = orderedImages[0]
  const hoverImage = orderedImages[1] ?? orderedImages[0]
  const colors = [
    ...new Set(
      variants
        .filter((variant) => variant.stock > 0)
        .map((variant) => variant.color)
        .filter(Boolean)
    ),
  ]
  const sizes = [
    ...new Set(
      variants
        .filter((variant) => variant.stock > 0)
        .map((variant) => variant.size)
        .filter(Boolean)
    ),
  ]

  return (
    <article className="group overflow-hidden rounded-[1.35rem] border border-[#E5DED4] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link href={`/productos/${product.slug}`} className="block">
        <div className="relative aspect-4/5 bg-[#F6F1EB]">
          <Image
            src={primaryImage.url}
            alt={parseProductImageAlt(primaryImage.alt).alt || product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />

          {hoverImage.id !== primaryImage.id ? (
            <Image
              src={hoverImage.url}
              alt={parseProductImageAlt(hoverImage.alt).alt || product.name}
              fill
              className="hidden object-cover opacity-0 transition duration-300 md:block md:group-hover:scale-[1.03] md:group-hover:opacity-100"
            />
          ) : null}

          <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2">
            {colors.length > 1 ? (
              <span className="rounded-full bg-white/92 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#4A3728] shadow-sm sm:px-3 sm:text-[10px] sm:tracking-[0.18em]">
                {colors.length} colores
              </span>
            ) : null}
            {sizes.length > 1 ? (
              <span className="rounded-full bg-[#2D241E]/88 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white shadow-sm sm:px-3 sm:text-[10px] sm:tracking-[0.18em]">
                {sizes.length} talles
              </span>
            ) : null}
          </div>

          <div className="absolute right-3 top-3">
            <ProductShareButton
              path={`/productos/${product.slug}`}
              productName={product.name}
              compact
            />
          </div>
        </div>
      </Link>

      <div className="space-y-2.5 p-3 sm:space-y-3 sm:p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B5E3C] sm:text-xs sm:tracking-widest">
          {product.categoryName}
        </p>

        <Link href={`/productos/${product.slug}`}>
          <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-[#4A3728] sm:text-base">
            {product.name}
          </h2>
        </Link>

        {product.shortDescription ? (
          <p className="hidden line-clamp-2 text-sm text-[#7A6A5F] sm:block">
            {product.shortDescription}
          </p>
        ) : null}

        <div className="space-y-1">
          <p className="text-base font-bold text-[#4A3728] sm:text-lg">
            {formatArs(product.price)}
          </p>
          <p className="text-[11px] leading-5 text-[#8B5E3C] sm:text-xs">
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
            price: product.price,
            image: primaryImage.url,
          }}
          variants={variants}
          onColorChange={setSelectedColor}
        />
      </div>
    </article>
  )
}
