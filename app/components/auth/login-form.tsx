'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import {
  loginUserAction,
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

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(
    loginUserAction,
    authInitialState
  )

  return (
    <section className="rounded-[2.5rem] bg-white p-8 shadow-[0_24px_80px_rgba(91,67,50,0.08)] sm:p-10">
      <h2 className="text-2xl font-semibold text-[#2f241d]">Inicia sesion</h2>
      <p className="mt-2 text-sm text-[#6f5b4d]">
        Accede a tu cuenta con tu email y contrasena.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <input type="hidden" name="next" value={next ?? ''} />
        <div>
          <label className="text-sm font-medium text-[#4b3425]" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
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
            htmlFor="login-password"
          >
            Contrasena
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="mt-2 h-12 w-full rounded-2xl border border-[#e3d5c8] bg-[#fffaf6] px-4 text-sm outline-none transition focus:border-[#8b684d]"
            placeholder="Ingresa tu contrasena"
          />
          <InputError state={state} name="password" />
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
          {pending ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="mt-6 text-sm text-[#6f5b4d]">
        ¿No tienes cuenta?{' '}
        <Link href="/registro" className="font-semibold text-[#4b3425] underline">
          Registrate
        </Link>
      </p>
    </section>
  )
}
