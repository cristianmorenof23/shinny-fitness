import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createMetadata } from '@/app/lib/seo'
import { getAuthSession, getPostLoginRedirect } from '@/app/lib/auth'
import { LoginForm } from '@/app/components/auth/login-form'

export const metadata: Metadata = createMetadata({
  title: 'Ingresar',
  description: 'Ingresa a tu cuenta de Shiny Fitness.',
  path: '/login',
  noIndex: true,
})

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const [session, params] = await Promise.all([getAuthSession(), searchParams])

  if (session) {
    redirect(getPostLoginRedirect(session.user.role, params.next))
  }

  return (
    <main className="min-h-screen bg-[#fcf8f4] px-4 py-16 text-[#2f241d]">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2.5rem] bg-[#2f241d] p-8 text-white shadow-2xl sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d5b693]">
            Bienvenida
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            Ingresa para seguir comprando, guardar tu cuenta y revisar tu perfil.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#dfd2c6]">
            Si tambien manejas el panel de administracion, puedes usar tu misma
            cuenta y entrar luego al dashboard.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 text-sm">
            <Link
              href="/registro"
              className="rounded-full bg-white px-6 py-3 font-medium text-[#2f241d] transition hover:opacity-90"
            >
              Crear cuenta
            </Link>
            <Link
              href="/admin/login"
              className="rounded-full border border-white/20 px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Ingreso admin
            </Link>
          </div>
        </section>

        <LoginForm next={params.next} />
      </div>
    </main>
  )
}
