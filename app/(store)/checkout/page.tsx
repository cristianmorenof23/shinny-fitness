import type { Metadata } from 'next'
import { createMetadata } from '@/app/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Checkout',
  description: 'Pantalla de checkout de Shiny Fitness.',
  path: '/checkout',
  noIndex: true,
})

export default function CheckoutPage() {
  return <div>CheckoutPage</div>
}
