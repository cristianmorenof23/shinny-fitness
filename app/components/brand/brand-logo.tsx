import Image from 'next/image'
import Link from 'next/link'

const LOGO_SRC = '/Shiny Fitness logo on transparent background.png'

export function BrandLogo({
  className = '',
  width = 164,
  height = 52,
  priority = false,
}: {
  className?: string
  width?: number
  height?: number
  priority?: boolean
}) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center transition-opacity hover:opacity-85 ${className}`}
      aria-label="Shiny Fitness"
    >
      <Image
        src={LOGO_SRC}
        alt="Shiny Fitness"
        width={width}
        height={height}
        priority={priority}
        className="h-auto w-auto object-contain"
      />
    </Link>
  )
}
