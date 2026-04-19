import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { createMetadata } from '@/app/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Productos',
  description:
    'Explora el catalogo de Shiny Fitness con ropa deportiva femenina, tops, calzas, shorts y conjuntos para cada entrenamiento.',
  path: '/productos',
  noIndex: true,
})

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return children
}
