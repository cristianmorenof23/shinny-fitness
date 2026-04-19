'use client'

import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'

export type UploadedImage = {
  url: string
  publicId: string
  alt?: string
}

interface ImageUploadProps {
  value: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  function handleRemove(publicId: string) {
    onChange(value.filter((image) => image.publicId !== publicId))
  }

  return (
    <div className="space-y-4">
      <CldUploadWidget
        uploadPreset="shiny_products"
        options={{
          multiple: true,
          folder: 'shiny-fitness/products',
          resourceType: 'image',
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        }}
        onSuccess={(result) => {
          const info = result?.info as {
            secure_url: string
            public_id: string
            original_filename?: string
          }

          if (!info?.secure_url || !info?.public_id) return

          onChange([
            ...value,
            {
              url: info.secure_url,
              publicId: info.public_id,
              alt: info.original_filename || '',
            },
          ])
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white hover:opacity-90"
          >
            Subir imágenes
          </button>
        )}
      </CldUploadWidget>

      {value.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((image) => (
            <div
              key={image.publicId}
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
            >
              <div className="relative h-48 w-full bg-neutral-100">
                <Image
                  src={image.url}
                  alt={image.alt || 'Imagen del producto'}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-3 p-3">
                <input
                  type="text"
                  value={image.alt || ''}
                  onChange={(e) => {
                    onChange(
                      value.map((item) =>
                        item.publicId === image.publicId
                          ? { ...item, alt: e.target.value }
                          : item
                      )
                    )
                  }}
                  placeholder="Texto alternativo"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                />

                <button
                  type="button"
                  onClick={() => handleRemove(image.publicId)}
                  className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}