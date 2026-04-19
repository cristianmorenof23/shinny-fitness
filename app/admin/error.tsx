'use client'

import { useEffect } from 'react'

export default function AdminError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error('Admin route error:', error)
  }, [error])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Productos</h1>
        <p className="text-sm text-neutral-500">
          Gestioná el catálogo de la tienda
        </p>
      </div>

      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-950 shadow-sm">
        <h2 className="text-lg font-semibold">Ocurrió un error inesperado</h2>
        <p className="mt-2 text-sm leading-6 text-red-900">
          El panel no pudo renderizarse por completo. Probá reintentar y, si el
          problema sigue, revisá la conexión con la base de datos.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="mt-5 inline-flex rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
