import type { Metadata } from 'next'
import Link from 'next/link'
import { LogoutButton } from '@/app/components/auth/logout-button'
import { requireAuth } from '@/app/lib/auth'
import { createMetadata } from '@/app/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Mi cuenta',
  description: 'Gestiona tu cuenta de Shiny Fitness.',
  path: '/cuenta',
  noIndex: true,
})

export default async function AccountPage() {
  const session = await requireAuth('/login?next=/cuenta')

  return (
    <main className="min-h-screen bg-[#fcf8f4] px-4 py-16 text-[#2f241d]">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="rounded-[2.5rem] bg-white p-8 shadow-[0_24px_80px_rgba(91,67,50,0.08)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8b684d]">
            Mi cuenta
          </p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            Hola, {session.user.name ?? session.user.email}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#6f5b4d]">
            Desde aqui puedes revisar tu acceso y salir de tu sesion actual.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-[2rem] bg-white p-8 shadow-[0_16px_50px_rgba(91,67,50,0.08)]">
            <h2 className="text-lg font-semibold">Datos de acceso</h2>
            <dl className="mt-6 space-y-4 text-sm text-[#6f5b4d]">
              <div>
                <dt className="font-semibold text-[#2f241d]">Nombre</dt>
                <dd>{session.user.name ?? 'Sin nombre cargado'}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#2f241d]">Email</dt>
                <dd>{session.user.email}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#2f241d]">Rol</dt>
                <dd>{session.user.role === 'ADMIN' ? 'Administrador' : 'Cliente'}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-[2rem] bg-[#2f241d] p-8 text-white shadow-[0_16px_50px_rgba(47,36,29,0.2)]">
            <h2 className="text-lg font-semibold">Acciones</h2>
            <div className="mt-6 space-y-4">
              {session.user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-[#2f241d] transition hover:opacity-90"
                >
                  Ir al panel admin
                </Link>
              )}
              <LogoutButton
                className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                label="Cerrar sesion"
              />
            </div>
          </article>
        </section>
      </div>
    </main>
  )
}
