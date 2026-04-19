import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { createMetadata } from '@/app/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Categorias',
  description:
    'Recorre las categorias de Shiny Fitness y encontra prendas deportivas femeninas segun tu estilo y tipo de entrenamiento.',
  path: '/categorias',
  noIndex: true,
})

export default function CategoriesLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
