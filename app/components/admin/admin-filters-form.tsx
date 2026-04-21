'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Link from 'next/link'

export function AdminFiltersForm({
  children,
  clearHref,
  className,
}: {
  children: ReactNode
  clearHref: string
  className: string
}) {
  const formRef = useRef<HTMLFormElement | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function scheduleSubmit(delay: number) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      formRef.current?.requestSubmit()
    }, delay)
  }

  return (
    <form
      ref={formRef}
      className={className}
      onInputCapture={(event) => {
        const target = event.target

        if (
          target instanceof HTMLInputElement &&
          (target.type === 'text' ||
            target.type === 'search' ||
            target.type === 'email' ||
            target.type === 'number')
        ) {
          scheduleSubmit(280)
        }
      }}
      onChangeCapture={(event) => {
        const target = event.target

        if (
          target instanceof HTMLSelectElement ||
          (target instanceof HTMLInputElement &&
            !['text', 'search', 'email', 'number'].includes(target.type))
        ) {
          scheduleSubmit(0)
        }
      }}
    >
      {children}

      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center rounded-full bg-[#fcf3ec] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8b684d]">
          Se actualiza en vivo
        </span>
        <Link
          href={clearHref}
          className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
        >
          Limpiar
        </Link>
      </div>
    </form>
  )
}
