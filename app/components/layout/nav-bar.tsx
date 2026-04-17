'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react'
import { useCartStore } from '@/app/store/cart-store'
import { CartDrawer } from '../cart/cart-drawer'

const navLinks = [
  { href: '/productos', label: 'Productos' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/sobre-mi', label: 'Sobre mí' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [openCart, setOpenCart] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [animate, setAnimate] = useState(false)

  const totalItems = useCartStore((state) => state.getTotalItems())

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnimate(true)
    const timeout = setTimeout(() => setAnimate(false), 400)

    return () => clearTimeout(timeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems])

  if (!mounted) return null

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#e7d9cc] bg-[#f8f3ee]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">

          {/* Menu mobile */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden text-[#4b3425]"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-semibold tracking-[0.2em] text-[#4b3425]"
          >
            SHINY
          </Link>

          {/* Buscador desktop */}
          <div className="hidden flex-1 px-6 lg:block">
            <form className="relative mx-auto max-w-xl">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="h-12 w-full rounded-full border border-[#dbc7b6] bg-white pl-5 pr-14 text-sm outline-none transition focus:border-[#a27b5c] focus:shadow-md"
              />

              <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#7b5a43] p-2 text-white transition hover:scale-105 hover:bg-[#6b4d39]">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Navegación desktop */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-sm font-medium text-[#4b3425] transition hover:text-[#8b684d]"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#8b684d] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full p-2 transition hover:bg-[#efe3d8] hover:scale-105"
            >
              <User className="h-5 w-5 text-[#4b3425]" />
            </Link>

            {/* Carrito */}
            <button
              onClick={() => setOpenCart(true)}
              className="relative rounded-full p-2 transition hover:bg-[#efe3d8] hover:scale-105"
            >
              <ShoppingCart className="h-5 w-5 text-[#4b3425]" />

              <span
                className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7b5a43] text-[10px] text-white ${
                  animate && totalItems > 0 ? 'cart-bounce' : ''
                }`}
              >
                {totalItems}
              </span>
            </button>
          </div>
        </div>

        {/* Buscador mobile */}
        <div className="border-t px-4 py-3 lg:hidden">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full rounded-full border border-[#dbc7b6] px-4 py-2 text-sm"
          />
        </div>
      </header>

      {/* 🔥 MOBILE DRAWER PREMIUM */}
      <div
        className={`fixed inset-0 z-999 transition ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Overlay */}
        <div
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Drawer */}
        <div
          className={`absolute left-0 top-0 h-full w-[85%] max-w-sm bg-[#f8f3ee] p-6 shadow-2xl flex flex-col transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold tracking-[0.2em] text-[#4b3425]">
              SHINY
            </span>

            <button onClick={() => setIsOpen(false)}>
              <X className="h-6 w-6 text-[#4b3425]" />
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 h-px w-full bg-[#e7d9cc]" />

          {/* Links */}
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-xl font-medium text-[#2f241d] transition hover:translate-x-1 hover:text-[#8b684d]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-10 text-sm text-[#8b684d]">
            <p>© {new Date().getFullYear()} Shiny</p>
          </div>
        </div>
      </div>

      {/* Cart drawer */}
      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </>
  )
}