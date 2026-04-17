'use client'

type Filters = {
  color: string | null
  sizes: string[]
  price: number
}

type Props = {
  filters: Filters
  setFilters: (filters: Filters) => void
}

const colors = [
  { name: 'Negro', value: '#000000' },
  { name: 'Blanco', value: '#ffffff' },
  { name: 'Beige', value: '#d6c3b3' },
  { name: 'Marrón', value: '#7b5a43' },
]

const sizesList = ['XS', 'S', 'M', 'L', 'XL']

export function FiltersSidebar({ filters, setFilters }: Props) {
  const { color, sizes, price } = filters

  return (
    <aside className="w-full max-w-xs space-y-8 rounded-2xl border border-[#eadfd5] bg-white p-6 shadow-sm">
      
      <h2 className="text-lg font-semibold text-[#2f241d]">
        Filtros
      </h2>

      {/* COLOR */}
      <div>
        <h3 className="mb-3 text-sm text-[#6f5b4d]">Color</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((c) => {
            const isActive = color === c.name

            return (
              <button
                key={c.name}
                onClick={() =>
                  setFilters({
                    ...filters,
                    color: isActive ? null : c.name,
                  })
                }
                className={`h-8 w-8 rounded-full border transition ${
                  isActive ? 'ring-2 ring-[#7b5a43] scale-110' : ''
                }`}
                style={{ backgroundColor: c.value }}
              />
            )
          })}
        </div>
      </div>

      {/* TALLES */}
      <div>
        <h3 className="mb-3 text-sm text-[#6f5b4d]">Talles</h3>
        <div className="flex flex-wrap gap-2">
          {sizesList.map((size) => {
            const isActive = sizes.includes(size)

            return (
              <button
                key={size}
                onClick={() => {
                  const newSizes = isActive
                    ? sizes.filter((s) => s !== size)
                    : [...sizes, size]

                  setFilters({ ...filters, sizes: newSizes })
                }}
                className={`rounded-full border px-4 py-1 text-sm ${
                  isActive
                    ? 'bg-[#7b5a43] text-white'
                    : 'hover:bg-[#f3e6dc]'
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* PRECIO */}
      <div>
        <h3 className="mb-3 text-sm text-[#6f5b4d]">Precio</h3>

        <input
          type="range"
          min={0}
          max={100000}
          value={price}
          onChange={(e) =>
            setFilters({ ...filters, price: Number(e.target.value) })
          }
          className="w-full accent-[#7b5a43]"
        />

        <p className="mt-2 text-sm">
          Hasta ${price.toLocaleString()}
        </p>
      </div>

      {/* LIMPIAR */}
      <button
        onClick={() =>
          setFilters({
            color: null,
            sizes: [],
            price: 100000,
          })
        }
        className="w-full rounded-full border py-2 text-sm hover:bg-[#f3e6dc]"
      >
        Limpiar filtros
      </button>
    </aside>
  )
}