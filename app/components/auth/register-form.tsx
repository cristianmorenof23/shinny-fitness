'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import {
  registerUserAction,
  type AuthActionState,
} from '@/app/actions/auth'
import { authInitialState } from '@/app/components/auth/auth-form-state'

function InputError({
  state,
  name,
}: {
  state: AuthActionState
  name: string
}) {
  const errors = state.fieldErrors?.[name]

  if (!errors?.length) {
    return null
  }

  return <p className="mt-2 text-sm text-red-600">{errors[0]}</p>
}

export function RegisterForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(
    registerUserAction,
    authInitialState
  )

  return (
    <section className="rounded-[2.5rem] bg-white p-8 shadow-[0_24px_80px_rgba(91,67,50,0.08)] sm:p-10">
      <h2 className="text-2xl font-semibold text-[#2f241d]">Crear cuenta</h2>
      <p className="mt-2 text-sm text-[#6f5b4d]">
        Registrate para guardar tus datos y seguir tus compras.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <input type="hidden" name="next" value={next ?? ''} />
        <div>
          <label className="text-sm font-medium text-[#4b3425]" htmlFor="register-name">
            Nombre
          </label>
          <input
            id="register-name"
            name="name"
            type="text"
            autoComplete="name"
            className="mt-2 h-12 w-full rounded-2xl border border-[#e3d5c8] bg-[#fffaf6] px-4 text-sm outline-none transition focus:border-[#8b684d]"
            placeholder="Tu nombre"
          />
          <InputError state={state} name="name" />
        </div>

        <div>
          <label className="text-sm font-medium text-[#4b3425]" htmlFor="register-email">
            Email
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            className="mt-2 h-12 w-full rounded-2xl border border-[#e3d5c8] bg-[#fffaf6] px-4 text-sm outline-none transition focus:border-[#8b684d]"
            placeholder="tuemail@email.com"
          />
          <InputError state={state} name="email" />
        </div>

        <div>
          <label
            className="text-sm font-medium text-[#4b3425]"
            htmlFor="register-password"
          >
            Contrasena
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            className="mt-2 h-12 w-full rounded-2xl border border-[#e3d5c8] bg-[#fffaf6] px-4 text-sm outline-none transition focus:border-[#8b684d]"
            placeholder="Minimo 6 caracteres"
          />
          <InputError state={state} name="password" />
        </div>

        <div>
          <label
            className="text-sm font-medium text-[#4b3425]"
            htmlFor="register-confirm-password"
          >
            Confirmar contrasena
          </label>
          <input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="mt-2 h-12 w-full rounded-2xl border border-[#e3d5c8] bg-[#fffaf6] px-4 text-sm outline-none transition focus:border-[#8b684d]"
            placeholder="Repite la contrasena"
          />
          <InputError state={state} name="confirmPassword" />
        </div>

        {state.formError ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#2f241d] px-6 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-6 text-sm text-[#6f5b4d]">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-semibold text-[#4b3425] underline">
          Inicia sesion
        </Link>
      </p>
    </section>
  )
}
