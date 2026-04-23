import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { createMetadata } from '@/app/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Catalogo de ropa deportiva femenina',
  description:
    'Explora el catalogo de Shiny Fitness: calzas, shorts, tops, crops, conjuntos, buzos y prendas deportivas femeninas con stock actualizado.',
  path: '/productos',
})

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return children
}
