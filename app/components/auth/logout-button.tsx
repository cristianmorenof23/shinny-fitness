'use client'

import { logoutUserAction } from '@/app/actions/auth'

export function LogoutButton({
  label = 'Salir',
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <form action={logoutUserAction}>
      <button
        type="submit"
        className={className ?? 'text-sm font-medium text-neutral-600 transition hover:text-neutral-900'}
      >
        {label}
      </button>
    </form>
  )
}
