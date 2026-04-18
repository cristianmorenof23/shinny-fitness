'use client'

import { useState } from 'react'
import { Prisma } from '../../../generated/prisma/client'

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const payload = {
      name,
      slug,
      description,
      shortDescription,
      price,
      compareAtPrice,
      categoryId,
      isFeatured,
      isNew,
      isActive,
    }

    console.log('Payload producto:', payload)

    alert(
      product
        ? 'Formulario listo para editar producto. Falta conectar server action.'
        : 'Formulario listo para crear producto. Falta conectar server action.'
    )
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
            onChange={(e) => {
              setName(e.target.value)
              if (!product) handleAutoSlug(e.target.value)
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
            onChange={(e) => setSlug(e.target.value)}
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
            Categoría
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
            required
          >
            <option value="">Seleccionar categoría</option>
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
            Descripción corta
          </label>
          <input
            id="shortDescription"
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Una descripción breve para cards y listados"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Descripción completa
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Descripción completa del producto"
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
            onChange={(e) => setPrice(e.target.value)}
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
            onChange={(e) => setCompareAtPrice(e.target.value)}
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
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4"
          />
          Producto destacado
        </label>

        <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
            className="h-4 w-4"
          />
          Producto nuevo
        </label>

        <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4"
          />
          Producto activo
        </label>
      </div>

      <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5">
        <h3 className="text-base font-semibold text-neutral-900">
          Imágenes y variantes
        </h3>
        <p className="mt-2 text-sm text-neutral-500">
          Después conectamos esta parte con tus componentes de upload y variantes.
          Primero dejemos sólido el alta y edición básica del producto.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="inline-flex rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          {product ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </form>
  )
}