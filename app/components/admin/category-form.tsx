'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { createCategory } from '@/app/actions/crear-categoria'

type CategoryFormProps = {
  defaultValues?: {
    name?: string
    slug?: string
    description?: string | null
    imageUrl?: string | null
    isActive?: boolean
  }
}

export default function CategoryForm({ defaultValues }: CategoryFormProps) {
  const router = useRouter()
  const [name, setName] = useState(defaultValues?.name ?? '')
  const [slug, setSlug] = useState(defaultValues?.slug ?? '')
  const [description, setDescription] = useState(defaultValues?.description ?? '')
  const [imageUrl, setImageUrl] = useState(defaultValues?.imageUrl ?? '')
  const [isActive, setIsActive] = useState(defaultValues?.isActive ?? true)
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
      const result = await createCategory({
        name,
        slug,
        description,
        imageUrl,
        isActive,
      })

      if (result?.ok === false) {
        toast.error('No pudimos crear la categoria. Revisa los datos e intenta otra vez.')
        return
      }

      toast.success('Categoria creada correctamente.')
      setName('')
      setSlug('')
      setDescription('')
      setImageUrl('')
      setIsActive(true)
      router.refresh()
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Nombre de la categoria
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              handleAutoSlug(event.target.value)
            }}
            placeholder="Ej: Calzas"
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
            placeholder="calzas"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
            required
          />
        </div>

        <div>
          <label
            htmlFor="imageUrl"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            URL de imagen
          </label>
          <input
            id="imageUrl"
            type="text"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="https://..."
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Descripcion
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Descripcion breve de la categoria"
            className="w-full resize-none rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-neutral-900"
          />
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-700">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
          className="h-4 w-4"
        />
        Categoria activa
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? 'Guardando...' : 'Crear categoria'}
      </button>
    </form>
  )
}
