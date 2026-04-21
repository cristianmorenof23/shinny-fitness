import type { Metadata } from 'next'
import { CheckoutPageClient } from '@/app/components/checkout/checkout-page'
import { getGoCuotasCheckoutState } from '@/app/lib/gocuotas'
import { createMetadata } from '@/app/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Checkout',
  description: 'Pantalla de checkout de Shiny Fitness.',
  path: '/checkout',
  noIndex: true,
})

export default function CheckoutPage() {
  const goCuotas = getGoCuotasCheckoutState()

  return <CheckoutPageClient goCuotas={goCuotas} />
}
