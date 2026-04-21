'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Filter, Search, X } from 'lucide-react'

type FilterCategory = {
  id: string
  name: string
  slug: string
}

type FilterValues = {
  search?: string
  categoria?: string
  color?: string
  talle?: string
}

type StorefrontFiltersProps = {
  categories: FilterCategory[]
  colors: string[]
  sizes: string[]
  current: FilterValues
}

function buildFilterQuery(filters: FilterValues) {
  const params = new URLSearchParams()

  if (filters.search?.trim()) {
    params.set('search', filters.search.trim())
  }
  if (filters.categoria) {
    params.set('categoria', filters.categoria)
  }
  if (filters.color) {
    params.set('color', filters.color)
  }
  if (filters.talle) {
    params.set('talle', filters.talle)
  }

  return params.toString()
}

function FilterPanel({
  categories,
  colors,
  sizes,
  filters,
  onSearchChange,
  onFilterChange,
  onClose,
}: StorefrontFiltersProps & {
  filters: Required<FilterValues>
  onSearchChange: (value: string) => void
  onFilterChange: (field: keyof FilterValues, value: string) => void
  onClose?: () => void
}) {
  return (
    <div className="space-y-6 rounded-[28px] border border-[#E5DED4] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#2D241E]">Filtros</h2>
          <p className="text-sm text-[#7A6A5F]">Busca por nombre o variante.</p>
        </div>

        <Link
          href="/productos"
          onClick={onClose}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5E3C]"
        >
          Limpiar
        </Link>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5E3C]">
          Buscar
        </label>
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Calzas, tops, conjuntos..."
            className="h-11 w-full rounded-full border border-[#E5DED4] bg-[#FDFBF9] px-4 pr-11 text-sm text-[#2D241E] outline-none transition focus:border-[#8B5E3C]"
          />
          <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B5E3C]" />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5E3C]">
          Categorias
        </p>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-[#4A3728]">
            <input
              type="radio"
              name="categoria"
              checked={!filters.categoria}
              onChange={() => {
                onFilterChange('categoria', '')
                onClose?.()
              }}
            />
            Todas
          </label>
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center gap-3 text-sm text-[#4A3728]"
            >
              <input
                type="radio"
                name="categoria"
                checked={filters.categoria === category.slug}
                onChange={() => {
                  onFilterChange('categoria', category.slug)
                  onClose?.()
                }}
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5E3C]">
          Colores
        </p>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-[#4A3728]">
            <input
              type="radio"
              name="color"
              checked={!filters.color}
              onChange={() => {
                onFilterChange('color', '')
                onClose?.()
              }}
            />
            Todos
          </label>
          {colors.map((color) => (
            <label
              key={color}
              className="flex cursor-pointer items-center gap-3 text-sm text-[#4A3728]"
            >
              <input
                type="radio"
                name="color"
                checked={filters.color === color}
                onChange={() => {
                  onFilterChange('color', color)
                  onClose?.()
                }}
              />
              {color}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5E3C]">
          Talles
        </p>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-[#4A3728]">
            <input
              type="radio"
              name="talle"
              checked={!filters.talle}
              onChange={() => {
                onFilterChange('talle', '')
                onClose?.()
              }}
            />
            Todos
          </label>
          {sizes.map((size) => (
            <label
              key={size}
              className="flex cursor-pointer items-center gap-3 text-sm text-[#4A3728]"
            >
              <input
                type="radio"
                name="talle"
                checked={filters.talle === size}
                onChange={() => {
                  onFilterChange('talle', size)
                  onClose?.()
                }}
              />
              {size}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export function StorefrontFilters(props: StorefrontFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<Required<FilterValues>>({
    search: props.current.search ?? '',
    categoria: props.current.categoria ?? '',
    color: props.current.color ?? '',
    talle: props.current.talle ?? '',
  })

  const queryString = useMemo(() => buildFilterQuery(filters), [filters])

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      })
    }, 250)

    return () => clearTimeout(timeout)
  }, [pathname, queryString, router])

  function updateFilter(field: keyof FilterValues, value: string) {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-[#dccbbc] bg-white px-4 py-2 text-sm font-semibold text-[#4A3728]"
        >
          <Filter className="h-4 w-4" />
          Filtros
        </button>

        <Link
          href="/productos"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5E3C]"
        >
          Limpiar
        </Link>
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-28">
          <FilterPanel
            {...props}
            filters={filters}
            onSearchChange={(value) => updateFilter('search', value)}
            onFilterChange={updateFilter}
          />
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-[32px] bg-[#FDFBF9] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#2D241E]">Filtrar productos</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[#E5DED4] p-2 text-[#4A3728]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <FilterPanel
              {...props}
              filters={filters}
              onSearchChange={(value) => updateFilter('search', value)}
              onFilterChange={updateFilter}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
