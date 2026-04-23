'use client'

import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'

export type UploadedImage = {
  url: string
  publicId: string
  color?: string
  alt?: string
}

interface ImageUploadProps {
  value: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  colorOptions?: string[]
}

export default function ImageUpload({
  value,
  onChange,
  colorOptions = [],
}: ImageUploadProps) {
  const normalizedColorOptions = [
    ...new Set(colorOptions.map((color) => color.trim()).filter(Boolean)),
  ]

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
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => open()}
              className="rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              Subir imagenes
            </button>
            <p className="text-xs text-neutral-500">
              Tip: carga primero las variantes para poder elegir el color de cada
              foto desde una lista. Asi la card cambia de imagen cuando eligen
              color.
            </p>
          </div>
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
                <div className="space-y-2 rounded-xl bg-neutral-50 p-3">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Color asociado
                  </label>

                  {normalizedColorOptions.length > 0 ? (
                    <select
                      value={image.color || ''}
                      onChange={(event) => {
                        onChange(
                          value.map((item) =>
                            item.publicId === image.publicId
                              ? { ...item, color: event.target.value }
                              : item
                          )
                        )
                      }}
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
                    >
                      <option value="">Sin color especifico</option>
                      {normalizedColorOptions.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={image.color || ''}
                      onChange={(event) => {
                        onChange(
                          value.map((item) =>
                            item.publicId === image.publicId
                              ? { ...item, color: event.target.value }
                              : item
                          )
                        )
                      }}
                      placeholder="Ej: Negro"
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
                    />
                  )}

                  <p className="text-xs leading-5 text-neutral-500">
                    Usa el mismo color que cargaste en variantes. Ejemplo:
                    Negro, Rosa o Blanco.
                  </p>
                </div>

                <input
                  type="text"
                  value={image.alt || ''}
                  onChange={(event) => {
                    onChange(
                      value.map((item) =>
                        item.publicId === image.publicId
                          ? { ...item, alt: event.target.value }
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
