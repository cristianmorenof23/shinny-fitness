import type { Metadata } from 'next'
import { createMetadata } from '@/app/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Compra exitosa',
  description: 'Pantalla de confirmacion de compra de Shiny Fitness.',
  path: '/success',
  noIndex: true,
})

export default function SuccessPage() {
  return <div>SuccessPage</div>
}
