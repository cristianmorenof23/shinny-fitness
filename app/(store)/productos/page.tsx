'use client'

import { FiltersSidebar } from '@/app/components/product/filters-sidebar'
import { ProductsGrid } from '@/app/components/product/products-grid'
import { useState } from 'react'

export default function ProductosPage() {
type Filters = {
  color: string | null
  sizes: string[]
  price: number
}

const [filters, setFilters] = useState<Filters>({
  color: null,
  sizes: [],
  price: 100000,
})

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      
      <h1 className="mb-8 text-3xl font-semibold">
        Productos
      </h1>

      <div className="flex gap-8">
        
        <div className="hidden lg:block">
          <FiltersSidebar filters={filters} setFilters={setFilters} />
        </div>

        <div className="flex-1">
          <ProductsGrid filters={filters} />
        </div>

      </div>
    </div>
  )
}