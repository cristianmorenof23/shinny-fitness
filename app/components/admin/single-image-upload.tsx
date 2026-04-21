'use client'

import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'

export type UploadedSingleImage = {
  url: string
  publicId: string
  alt?: string
}

interface SingleImageUploadProps {
  value: UploadedSingleImage | null
  onChange: (image: UploadedSingleImage | null) => void
  folder: string
  buttonLabel?: string
}

export default function SingleImageUpload({
  value,
  onChange,
  folder,
  buttonLabel = 'Subir imagen',
}: SingleImageUploadProps) {
  return (
    <div className="space-y-4">
      <CldUploadWidget
        uploadPreset="shiny_products"
        options={{
          multiple: false,
          folder,
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

          onChange({
            url: info.secure_url,
            publicId: info.public_id,
            alt: info.original_filename || '',
          })
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white hover:opacity-90"
          >
            {buttonLabel}
          </button>
        )}
      </CldUploadWidget>

      {value ? (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="relative h-56 w-full bg-neutral-100">
            <Image
              src={value.url}
              alt={value.alt || 'Imagen subida'}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-3 p-3">
            <input
              type="text"
              value={value.alt || ''}
              onChange={(event) =>
                onChange({
                  ...value,
                  alt: event.target.value,
                })
              }
              placeholder="Texto alternativo"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
            />

            <button
              type="button"
              onClick={() => onChange(null)}
              className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Eliminar imagen
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
