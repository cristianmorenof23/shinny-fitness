'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useCartStore } from '@/app/store/cart-store'
import { CartDrawer } from '../cart/cart-drawer'

const navLinks = [
  { href: '/productos', label: 'Productos' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/sobre-mi', label: 'Sobre mí' },
]

export function Navbar() {
  // --- Estados ---
  const [isOpen, setIsOpen] = useState(false) // Menu mobile
  const [openCart, setOpenCart] = useState(false) // Drawer carrito
  const [mounted, setMounted] = useState(false) // Evitar errores de hidratación
  const [animate, setAnimate] = useState(false) // Animación del badge del carrito
  const [searchQuery, setSearchQuery] = useState('') // Lógica de búsqueda

  const router = useRouter()
  const totalItems = useCartStore((state) => state.getTotalItems())

  // --- Efectos ---
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || totalItems === 0) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnimate(true)
    const timeout = setTimeout(() => setAnimate(false), 400)
    return () => clearTimeout(timeout)
  }, [totalItems, mounted])

  // --- Manejadores ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    // Redirección con el parámetro de búsqueda
    router.push(`/productos?search=${encodeURIComponent(searchQuery.trim())}`)
    setSearchQuery('')
    setIsOpen(false)
  }

  if (!mounted) return null

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#E5DED4] bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8 lg:gap-8">

          {/* Botón Menu Mobile */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden text-[#2D241E] p-1"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-[0.25em] text-[#4A3728] transition-opacity hover:opacity-80"
          >
            SHINY
          </Link>

          {/* Buscador Desktop - Funcional */}
          <div className="hidden flex-1 px-6 lg:block">
            <form onSubmit={handleSearch} className="relative mx-auto max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="¿Qué estás buscando?"
                className="h-10 w-full rounded-full border border-[#E5DED4] bg-[#FDFBF9] pl-5 pr-12 text-sm text-[#2D241E] outline-none transition focus:border-[#8B5E3C] focus:bg-white"
              />
              <button 
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-[#4A3728] text-white transition hover:bg-[#8B5E3C]"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-[11px] font-bold uppercase tracking-[0.15em] text-[#5C4D42] transition-colors hover:text-[#8B5E3C]"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-[#8B5E3C] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#4A3728] transition-colors hover:bg-[#F5F0EB]"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Carrito */}
            <button
              onClick={() => setOpenCart(true)}
              className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#4A3728] text-white transition-all hover:bg-[#2D241E] hover:scale-105"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              
              {totalItems > 0 && (
                <span
                  className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8B5E3C] border-2 border-white text-[9px] font-bold text-white transition-all ${
                    animate ? 'scale-125' : 'scale-100'
                  }`}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Buscador Mobile - Aparece debajo del logo en móviles */}
        <div className="border-t border-[#E5DED4] px-4 py-3 lg:hidden bg-white">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="h-10 w-full rounded-full border border-[#E5DED4] bg-[#FDFBF9] px-4 text-sm outline-none focus:border-[#8B5E3C]"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 text-[#4A3728]" />
            </button>
          </form>
        </div>
      </header>

      {/* --- MENU MOBILE DRAWER --- */}
      <div
        className={`fixed inset-0 z-100 transition-visibility duration-300 ${
          isOpen ? 'visible' : 'invisible'
        }`}
      >
        <div
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-[#2D241E]/40 backdrop-blur-sm transition-opacity duration-500 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          className={`absolute left-0 top-0 h-full w-[80%] max-w-xs bg-white p-8 shadow-2xl flex flex-col transition-transform duration-500 ease-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between mb-12">
            <span className="text-xl font-bold tracking-[0.2em] text-[#4A3728]">SHINY</span>
            <button onClick={() => setIsOpen(false)} className="p-2 rounded-full bg-[#F5F0EB]">
              <X className="h-5 w-5 text-[#4A3728]" />
            </button>
          </div>

          <nav className="flex flex-col gap-8">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-bold text-[#2D241E] transition-transform hover:translate-x-2"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-[#E5DED4] pt-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8B5E3C]">
              Síguenos en Instagram
            </p>
            <p className="mt-2 text-xs text-[#5C4D42]">@shiny.fitness</p>
          </div>
        </div>
      </div>

      {/* Drawer del Carrito */}
      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </>
  )
}