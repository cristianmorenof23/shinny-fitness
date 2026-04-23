'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ProductPurchasePanel } from '@/app/components/product/product-purchase-panel'
import {
  parseProductImageAlt,
  sortImagesByColor,
} from '@/app/lib/product-images'

type ProductDetailImage = {
  id: string
  url: string
  alt: string | null
}

type ProductDetailVariant = {
  id: string
  color: string | null
  size: string | null
  stock: number
}

type ProductDetailViewProps = {
  product: {
    id: string
    name: string
    slug: string
    price: number
    image: string
  }
  images: ProductDetailImage[]
  variants: ProductDetailVariant[]
}

export function ProductDetailView({
  product,
  images,
  variants,
}: ProductDetailViewProps) {
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

  const [selectedColor, setSelectedColor] = useState('')
  const [manualSelectedImageId, setManualSelectedImageId] = useState(
    allImages[0]?.id ?? 'fallback'
  )

  const filteredImages = useMemo(() => {
    return sortImagesByColor(allImages, selectedColor)
  }, [allImages, selectedColor])

  const activeImage = useMemo(
    () =>
      filteredImages.find((image) => image.id === manualSelectedImageId) ??
      filteredImages[0] ??
      allImages[0],
    [allImages, filteredImages, manualSelectedImageId]
  )

  return (
    <div className="space-y-4">
      <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-white">
        <Image
          src={activeImage?.url ?? product.image}
          alt={parseProductImageAlt(activeImage?.alt).alt || product.name}
          fill
          className="object-cover"
        />
      </div>

      {filteredImages.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {filteredImages.map((image) => {
            const isSelected = image.id === activeImage?.id

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setManualSelectedImageId(image.id)}
                className={`relative aspect-square overflow-hidden rounded-2xl border bg-white transition ${
                  isSelected
                    ? 'border-[#4A3728] ring-2 ring-[#4A3728]/15'
                    : 'border-transparent hover:border-[#dccbbc]'
                }`}
              >
                <Image
                  src={image.url}
                  alt={parseProductImageAlt(image.alt).alt || product.name}
                  fill
                  className="object-cover"
                />
              </button>
            )
          })}
        </div>
      ) : null}

      <ProductPurchasePanel
        product={product}
        variants={variants}
        onColorChange={setSelectedColor}
      />
    </div>
  )
}
