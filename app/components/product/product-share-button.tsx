'use client'

import { useTransition } from 'react'
import { Link2, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { absoluteUrl } from '@/app/lib/seo'

type ProductShareButtonProps = {
  path: string
  productName: string
  className?: string
  compact?: boolean
}

export function ProductShareButton({
  path,
  productName,
  className = '',
  compact = false,
}: ProductShareButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleShare = () => {
    startTransition(async () => {
      const shareUrl = absoluteUrl(path)
      const isMobile =
        typeof window !== 'undefined' &&
        window.matchMedia('(max-width: 767px)').matches

      try {
        if (isMobile && typeof navigator.share === 'function') {
          await navigator.share({
            title: productName,
            text: `Mira este producto de Shiny Fitness: ${productName}`,
            url: shareUrl,
          })
          toast.success('Link listo para compartir.')
          return
        }

        await navigator.clipboard.writeText(shareUrl)
        toast.success('Link copiado al portapapeles.')
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return
        }

        toast.error('No pudimos compartir este producto ahora.')
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={isPending}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-[#dccbbc] bg-white/95 text-[#4A3728] transition hover:bg-[#f8efe7] disabled:cursor-not-allowed disabled:opacity-70 ${
        compact
          ? 'h-10 w-10'
          : 'px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em]'
      } ${className}`}
      aria-label={`Compartir ${productName}`}
    >
      {compact ? (
        typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? (
          <Share2 className="h-4 w-4" />
        ) : (
          <Link2 className="h-4 w-4" />
        )
      ) : (
        <>
          <Link2 className="h-4 w-4" />
          Copiar link
        </>
      )}
    </button>
  )
}
