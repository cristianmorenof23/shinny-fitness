'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Prisma } from '../../../generated/prisma/client'
import { createProduct } from '@/app/actions/product'
import ImageUpload, { UploadedImage } from './image-upload'

type Category = {
  id: string
  name: string
}

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    images: true
    variants: true
  }
}>

interface ProductFormProps {
  categories: Category[]
  product?: ProductWithRelations
}

export default function ProductForm({
  categories,
  product,
}: ProductFormProps) {
  const router = useRouter()
  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [shortDescription, setShortDescription] = useState(
    product?.shortDescription ?? ''
  )
  const [price, setPrice] = useState(product?.price?.toString() ?? '')
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compareAtPrice?.toString() ?? ''
  )
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? '')
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false)
  const [isNew, setIsNew] = useState(product?.isNew ?? false)
  const [isActive, setIsActive] = useState(product?.isActive ?? true)
  const [images, setImages] = useState<UploadedImage[]>(
    product?.images?.length
      ? product.images.map((image) => ({
          url: image.url,
          publicId: image.id,
          alt: image.alt ?? '',
        }))
      : []
  )
  const [isPending, startTransition] = useTransition()

  function handleAutoSlug(value: string) {
    const generatedSlug = value
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    setSlug(generatedSlug)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    startTransition(async () => {
      const result = await createProduct({
        name,
        slug,
        description,
        shortDescription,
        price: price.toString(),
        compareAtPrice: compareAtPrice?.toString() || '',
        categoryId,
        isFeatured,
        isNew,
        isActive,
        images: images.map((image) => ({
          url: image.url,
          alt: image.alt || '',
        })),
      })

      if (result?.ok === false) {
        toast.error('No pudimos guardar el producto. Revisa los campos e intenta otra vez.')
        return
      }

      toast.success(product ? 'Producto actualizado.' : 'Producto creado correctamente.')
      router.push(result?.redirectTo ?? '/admin/productos')
      router.refresh()
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Nombre del producto
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              if (!product) handleAutoSlug(event.target.value)
            }}
            placeholder="Ej: Calza Energy Black"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
            required
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Slug
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="calza-energy-black"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Categoria
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
            required
          >
            <option value="">Seleccionar categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="shortDescription"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Descripcion corta
          </label>
          <input
            id="shortDescription"
            type="text"
            value={shortDescription}
            onChange={(event) => setShortDescription(event.target.value)}
            placeholder="Una descripcion breve para cards y listados"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Descripcion completa
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            placeholder="Descripcion completa del producto"
            className="w-full resize-none rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
            required
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Precio
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="0.00"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
            required
          />
        </div>

        <div>
          <label
            htmlFor="compareAtPrice"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Precio anterior
          </label>
          <input
            id="compareAtPrice"
            type="number"
            min="0"
            step="0.01"
            value={compareAtPrice}
            onChange={(event) => setCompareAtPrice(event.target.value)}
            placeholder="0.00"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
          />
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 md:grid-cols-3">
        <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(event) => setIsFeatured(event.target.checked)}
            className="h-4 w-4"
          />
          Producto destacado
        </label>

        <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(event) => setIsNew(event.target.checked)}
            className="h-4 w-4"
          />
          Producto nuevo
        </label>

        <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="h-4 w-4"
          />
          Producto activo
        </label>
      </div>

      <div className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">Imagenes</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Sube las fotos del producto desde tu compu o celular.
          </p>
        </div>

        <ImageUpload value={images} onChange={setImages} />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {isPending
            ? 'Guardando...'
            : product
              ? 'Guardar cambios'
              : 'Crear producto'}
        </button>
      </div>
    </form>
  )
}
