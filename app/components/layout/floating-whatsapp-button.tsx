'use client'

import { usePathname } from 'next/navigation'
import { WhatsAppIcon } from '@/app/components/icons/social-icons'
import { buildWhatsAppUrl } from '@/app/lib/contact'

const defaultMessage =
  'Hola Shiny Fitness, queria hacer una consulta sobre productos, pagos o envios.'

export function FloatingWhatsAppButton() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <a
      href={buildWhatsAppUrl(defaultMessage)}
      target="_blank"
      rel="noreferrer"
      aria-label="Abrir WhatsApp de Shiny Fitness"
      className="fixed bottom-5 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_35px_rgba(37,211,102,0.28)] transition hover:scale-[1.04] hover:shadow-[0_22px_40px_rgba(37,211,102,0.34)] sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
    >
      <WhatsAppIcon className="h-7 w-7 sm:h-8 sm:w-8" />
    </a>
  )
}
