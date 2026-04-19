import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { createMetadata } from '@/app/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Carrito',
  description: 'Carrito de compras de Shiny Fitness.',
  path: '/carrito',
  noIndex: true,
})

export default function CartLayout({ children }: { children: ReactNode }) {
  return children
}
