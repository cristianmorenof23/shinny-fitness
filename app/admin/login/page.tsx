import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createMetadata } from '@/app/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Login admin',
  description: 'Acceso privado al panel de administracion de Shiny Fitness.',
  path: '/admin/login',
  noIndex: true,
})

export default function LoginPage() {
  redirect('/login?next=/admin')
}
