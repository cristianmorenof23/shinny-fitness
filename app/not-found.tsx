import Link from 'next/link'
import { ArrowRight, Home, Search, ShoppingBag } from 'lucide-react'

const quickLinks = [
  {
    href: '/productos',
    title: 'Explorar catalogo',
    description: 'Descubri calzas, tops, shorts y conjuntos disponibles ahora.',
    icon: ShoppingBag,
  },
  {
    href: '/',
    title: 'Volver al inicio',
    description: 'Regresa a la portada principal de Shiny Fitness.',
    icon: Home,
  },
  {
    href: '/productos?search=calzas',
    title: 'Buscar calzas',
    description: 'Ir directo a una de las categorias mas consultadas.',
    icon: Search,
  },
] as const

export default function NotFound() {
  return (
    <main className="min-h-[75vh] bg-[#fcf8f4] py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-[#eadfd5] bg-white shadow-[0_10px_30px_rgba(91,67,50,0.05)]">
          <div className="relative overflow-hidden bg-[#2D241E] px-8 py-14 text-white sm:px-12">
            <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#8B5E3C]/30 blur-[70px]" />
            <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[#D4AF37]/10 blur-[80px]" />

            <div className="relative max-w-3xl">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#E7D4C4]">
                Error 404
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
                Esta pagina no esta disponible, pero tu proximo look si.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#E7D4C4] sm:text-base">
                Es posible que el enlace haya cambiado o que Google todavia este
                mostrando una URL vieja. Te dejamos accesos rapidos para seguir
                navegando sin perderte nada.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/productos"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#2D241E] transition hover:bg-[#f7efe8]"
                >
                  Ir al catalogo
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-8 py-8 sm:px-12 lg:grid-cols-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-[28px] border border-[#eadfd5] bg-[#fffaf6] p-6 transition hover:-translate-y-0.5 hover:border-[#d9c6b6] hover:shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1e5da] text-[#8b684d]">
                  <link.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-lg font-semibold text-[#2f241d]">
                  {link.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#6f5b4d]">
                  {link.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
