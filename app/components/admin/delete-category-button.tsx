'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { deleteCategory } from '@/app/actions/crear-categoria'

type DeleteCategoryButtonProps = {
  categoryId: string
  categoryName: string
}

export default function DeleteCategoryButton({
  categoryId,
  categoryName,
}: DeleteCategoryButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCategory(categoryId)

      if (!result.ok) {
        toast.error(result.error || 'No pudimos eliminar la categoria.')
        return
      }

      setIsOpen(false)
      toast.success('Categoria eliminada correctamente.')
      router.refresh()
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={isPending}
        className="inline-flex rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? 'Eliminando...' : 'Eliminar'}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2f241d]/35 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] border border-[#eadfd5] bg-white p-6 shadow-[0_20px_60px_rgba(47,36,29,0.16)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-red-50 p-3 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#2f241d]">
                    Eliminar categoria
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#6f5b4d]">
                    Vas a eliminar{' '}
                    <span className="font-semibold text-[#2f241d]">
                      &quot;{categoryName}&quot;
                    </span>{' '}
                    de forma definitiva. Si tiene productos asociados, la tienda
                    no va a permitir borrarla.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="rounded-full p-2 text-[#8b684d] transition hover:bg-[#f7efe8] disabled:cursor-not-allowed"
                aria-label="Cerrar confirmacion"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="inline-flex items-center justify-center rounded-full border border-[#dccbbc] px-5 py-3 text-sm font-medium text-[#4b3425] transition hover:bg-[#f8efe7] disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Trash2 className="h-4 w-4" />
                {isPending ? 'Eliminando...' : 'Si, eliminar'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
