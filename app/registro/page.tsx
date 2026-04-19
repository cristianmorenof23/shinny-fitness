import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { RegisterForm } from '@/app/components/auth/register-form'
import { getAuthSession, getPostLoginRedirect } from '@/app/lib/auth'
import { createMetadata } from '@/app/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Crear cuenta',
  description: 'Crea tu cuenta en Shiny Fitness para comprar y gestionar tu perfil.',
  path: '/registro',
  noIndex: true,
})

export default async function RegisterPage({
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
        <section className="rounded-[2.5rem] bg-white p-8 shadow-[0_24px_80px_rgba(91,67,50,0.08)] sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8b684d]">
            Tu cuenta
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            Crea un perfil para comprar mas rapido y seguir tus pedidos.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#6f5b4d]">
            Guarda tus datos, accede a tu cuenta cuando quieras y mantente cerca
            de todo lo nuevo de Shiny Fitness.
          </p>
          <p className="mt-10 text-sm text-[#6f5b4d]">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-semibold text-[#4b3425] underline">
              Inicia sesion aqui
            </Link>
          </p>
        </section>

        <RegisterForm next={params.next} />
      </div>
    </main>
  )
}
