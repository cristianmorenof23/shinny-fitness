'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, Search, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/app/store/cart-store'

function ProductsPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const totalItems = useCartStore((state) => state.getTotalItems())

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true) }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/productos?search=${encodeURIComponent(searchQuery.trim())}`)
    setSearchQuery('')
    setIsOpen(false)
  }

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5DED4] bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-4 lg:px-8">
        <Link href="/" className="text-2xl font-bold tracking-[0.25em] text-[#4A3728]">SHINY</Link>

        {/* Buscador Desktop */}
        <div className="hidden flex-1 px-6 lg:block">
          <form onSubmit={handleSearch} className="relative mx-auto max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="¿Qué estás buscando?"
              className="h-10 w-full rounded-full border border-[#E5DED4] bg-[#FDFBF9] pl-5 pr-12 text-sm outline-none focus:border-[#8B5E3C]"
            />
            <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-[#4A3728] text-white transition hover:bg-[#8B5E3C]">
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="/productos" className="text-[11px] font-bold uppercase tracking-widest text-[#5C4D42] hover:text-[#8B5E3C]">Productos</Link>
          <Link href="/contacto" className="text-[11px] font-bold uppercase tracking-widest text-[#5C4D42] hover:text-[#8B5E3C]">Contacto</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={() => {/* Lógica abrir carrito */}} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#4A3728] text-white">
            <ShoppingBag className="h-4.5 w-4.5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#8B5E3C] border-2 border-white text-[9px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>
          <button onClick={() => setIsOpen(true)} className="lg:hidden text-[#4A3728]"><Menu /></button>
        </div>
      </div>
    </header>
  )
}

export default ProductsPage
