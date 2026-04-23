'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { toast } from 'sonner'
import { BrandLogo } from '@/app/components/brand/brand-logo'
import { useCartStore } from '@/app/store/cart-store'
import { CartDrawer } from '../cart/cart-drawer'

const navLinks = [
  { href: '/productos', label: 'Productos' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/sobre-mi', label: 'Sobre mi' },
]

const categoryLinks = [
  { label: 'Calzas', searchTerm: 'Calzas' },
  { label: 'Shorts', searchTerm: 'Shorts' },
  { label: 'Tops', searchTerm: 'Tops' },
  { label: 'Crops', searchTerm: 'Crops' },
  { label: 'Conjuntos largos', searchTerm: 'Conjuntos largos' },
  { label: 'Conjuntos cortos', searchTerm: 'Conjuntos cortos' },
  { label: 'Camperas', searchTerm: 'Camperas' },
  { label: 'Pantalon', searchTerm: 'Pantalon' },
  { label: 'Buzos', searchTerm: 'Buzos' },
  { label: 'Chalecos', searchTerm: 'Chalecos' },
  { label: 'Catsuits', searchTerm: 'Catsuits' },
  { label: 'Remeras', searchTerm: 'Remeras' },
]

type SearchResult = {
  id: string
  name: string
  slug: string
  price: number
  category: string
  image: string
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

function SearchResultsDropdown({
  query,
  results,
  loading,
  onSelect,
}: {
  query: string
  results: SearchResult[]
  loading: boolean
  onSelect: () => void
}) {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    return null
  }

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-50 overflow-hidden rounded-[24px] border border-[#E5DED4] bg-white shadow-[0_20px_60px_rgba(74,55,40,0.14)]">
      {loading ? (
        <p className="px-4 py-4 text-sm text-[#6f5b4d]">Buscando productos...</p>
      ) : results.length === 0 ? (
        <div className="px-4 py-4">
          <p className="text-sm text-[#6f5b4d]">
            No encontramos resultados para &quot;{trimmedQuery}&quot;.
          </p>
          <Link
            href={`/productos?search=${encodeURIComponent(trimmedQuery)}`}
            onClick={onSelect}
            className="mt-3 inline-flex text-sm font-semibold text-[#8B5E3C] hover:text-[#4A3728]"
          >
            Ver todos los resultados
          </Link>
        </div>
      ) : (
        <div>
          <div className="max-h-[360px] overflow-y-auto">
            {results.map((result) => (
              <Link
                key={result.id}
                href={`/productos/${result.slug}`}
                onClick={onSelect}
                className="flex items-center gap-3 border-b border-[#f2e8de] px-4 py-3 transition hover:bg-[#fcf8f4] last:border-b-0"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#F6F1EB]">
                  <Image
                    src={result.image}
                    alt={result.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8B5E3C]">
                    {result.category}
                  </p>
                  <p className="truncate text-sm font-semibold text-[#2D241E]">
                    {result.name}
                  </p>
                  <p className="text-sm text-[#6f5b4d]">{formatPrice(result.price)}</p>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href={`/productos?search=${encodeURIComponent(trimmedQuery)}`}
            onClick={onSelect}
            className="flex items-center justify-between bg-[#fcf8f4] px-4 py-3 text-sm font-semibold text-[#4A3728] transition hover:bg-[#f5ede6]"
          >
            Ver todos los resultados
            <span className="text-[#8B5E3C]">{results.length} sugerencias</span>
          </Link>
        </div>
      )}
    </div>
  )
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [openCart, setOpenCart] = useState(false)
  const [showDesktopCategories, setShowDesktopCategories] = useState(false)
  const [showMobileCategories, setShowMobileCategories] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  const router = useRouter()
  const totalItems = useCartStore((state) => state.getTotalItems())
  const hasSearchQuery = useMemo(() => searchQuery.trim().length >= 2, [searchQuery])
  const desktopCategoriesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  useEffect(() => {
    return () => {
      if (desktopCategoriesTimeoutRef.current) {
        clearTimeout(desktopCategoriesTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!hasSearchQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchResults([])
      setIsSearching(false)
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      try {
        setIsSearching(true)
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery.trim())}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('Search request failed')
        }

        const data = (await response.json()) as { results: SearchResult[] }
        setSearchResults(data.results ?? [])
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error searching products:', error)
        }
      } finally {
        setIsSearching(false)
      }
    }, 220)

    return () => {
      controller.abort()
      clearTimeout(timeout)
    }
  }, [hasSearchQuery, searchQuery])

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    if (!searchQuery.trim()) {
      toast.info('Escribe al menos un producto para buscar.')
      return
    }

    router.push(`/productos?search=${encodeURIComponent(searchQuery.trim())}`)
    setShowSearchResults(false)
    setIsOpen(false)
  }

  const closeSearchResults = () => {
    setShowSearchResults(false)
    setSearchQuery('')
  }

  const closeMobileMenu = () => {
    setIsOpen(false)
    setShowMobileCategories(false)
  }

  const openDesktopCategoriesMenu = () => {
    if (desktopCategoriesTimeoutRef.current) {
      clearTimeout(desktopCategoriesTimeoutRef.current)
    }

    setShowDesktopCategories(true)
  }

  const closeDesktopCategoriesMenu = () => {
    desktopCategoriesTimeoutRef.current = setTimeout(() => {
      setShowDesktopCategories(false)
    }, 180)
  }

  if (!mounted) return null

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#E5DED4] bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8 lg:gap-8">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="p-1 text-[#2D241E] lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <BrandLogo className="shrink-0" width={150} height={42} priority />

          <div className="relative hidden flex-1 px-6 lg:block">
            <form onSubmit={handleSearch} className="relative mx-auto max-w-md">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSearchResults(true)}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Que estas buscando?"
                className="h-10 w-full rounded-full border border-[#E5DED4] bg-[#FDFBF9] pl-5 pr-12 text-sm text-[#2D241E] outline-none transition focus:border-[#8B5E3C] focus:bg-white"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#4A3728] text-white transition hover:bg-[#8B5E3C]"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            {showSearchResults ? (
              <SearchResultsDropdown
                query={searchQuery}
                results={searchResults}
                loading={isSearching}
                onSelect={closeSearchResults}
              />
            ) : null}
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              link.href === '/productos' ? (
                <div
                  key={link.href}
                  className="group relative"
                  onMouseEnter={openDesktopCategoriesMenu}
                  onMouseLeave={closeDesktopCategoriesMenu}
                >
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#5C4D42] transition-colors hover:text-[#8B5E3C]"
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${
                        showDesktopCategories ? 'rotate-180 text-[#8B5E3C]' : ''
                      }`}
                    />
                    <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-[#8B5E3C] transition-all duration-300 group-hover:w-full" />
                  </Link>

                  <div
                    className={`absolute left-1/2 top-[calc(100%+1.25rem)] z-50 w-[720px] -translate-x-1/2 rounded-[28px] border border-[#E7D9C9] bg-white p-6 shadow-[0_24px_70px_rgba(74,55,40,0.18)] transition-all duration-200 ${
                      showDesktopCategories
                        ? 'pointer-events-auto translate-y-0 opacity-100'
                        : 'pointer-events-none -translate-y-2 opacity-0'
                    }`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#8B5E3C]">
                          Categorias
                        </p>
                        <p className="mt-1 text-sm text-[#6B5647]">
                          Explora la coleccion segun la prenda que buscas.
                        </p>
                      </div>
                      <Link
                        href="/productos"
                        className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4A3728] transition hover:text-[#8B5E3C]"
                      >
                        Ver todo
                      </Link>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                      {categoryLinks.map((category) => (
                        <Link
                          key={category.label}
                          href={`/productos?search=${encodeURIComponent(category.searchTerm)}`}
                          className="rounded-[20px] border border-[#EEE1D4] bg-[#FCF8F4] px-4 py-4 text-center text-xs font-bold uppercase tracking-[0.14em] text-[#4A3728] transition hover:border-[#C9A98A] hover:bg-white hover:text-[#8B5E3C]"
                        >
                          {category.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative text-[11px] font-bold uppercase tracking-[0.15em] text-[#5C4D42] transition-colors hover:text-[#8B5E3C]"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-[#8B5E3C] transition-all duration-300 group-hover:w-full" />
                </Link>
              )
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/cuenta"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#4A3728] transition-colors hover:bg-[#F5F0EB]"
            >
              <User className="h-5 w-5" />
            </Link>

            <button
              type="button"
              onClick={() => setOpenCart(true)}
              className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#4A3728] text-white transition-all hover:scale-105 hover:bg-[#2D241E]"
            >
              <ShoppingBag className="h-4.5 w-4.5" />

              {totalItems > 0 ? (
                <span
                  className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#8B5E3C] text-[9px] font-bold text-white transition-all ${
                    animate ? 'scale-125' : 'scale-100'
                  }`}
                >
                  {totalItems}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        <div className="border-t border-[#E5DED4] bg-white px-4 py-3 lg:hidden">
          <div className="relative">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSearchResults(true)}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Buscar productos..."
                className="h-10 w-full rounded-full border border-[#E5DED4] bg-[#FDFBF9] px-4 text-sm outline-none focus:border-[#8B5E3C]"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Search className="h-4 w-4 text-[#4A3728]" />
              </button>
            </form>

            {showSearchResults ? (
              <SearchResultsDropdown
                query={searchQuery}
                results={searchResults}
                loading={isSearching}
                onSelect={closeSearchResults}
              />
            ) : null}
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[100] transition-[visibility] duration-300 ${
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
          className={`absolute left-0 top-0 flex h-full w-[80%] max-w-xs flex-col bg-white p-8 shadow-2xl transition-transform duration-500 ease-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-12 flex items-center justify-between">
            <BrandLogo width={148} height={40} />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-[#F5F0EB] p-2"
            >
              <X className="h-5 w-5 text-[#4A3728]" />
            </button>
          </div>

          <nav className="flex flex-col gap-8">
            {navLinks.map((link, index) => (
              link.href === '/productos' ? (
                <div key={link.href} style={{ transitionDelay: `${index * 50}ms` }}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="text-2xl font-bold text-[#2D241E] transition-transform hover:translate-x-2"
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShowMobileCategories((current) => !current)}
                      className="rounded-full border border-[#E5DED4] p-2 text-[#4A3728]"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          showMobileCategories ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <div
                    className={`grid overflow-hidden transition-all duration-300 ${
                      showMobileCategories
                        ? 'mt-5 grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="grid grid-cols-2 gap-3 rounded-[24px] border border-[#E7D9C9] bg-[#FCF8F4] p-4">
                        {categoryLinks.map((category) => (
                          <Link
                            key={category.label}
                            href={`/productos?search=${encodeURIComponent(category.searchTerm)}`}
                            onClick={closeMobileMenu}
                            className="rounded-[18px] border border-[#E7D9C9] bg-white px-4 py-3 text-sm font-semibold text-[#3B2E26] transition hover:border-[#C9A98A] hover:text-[#8B5E3C]"
                          >
                            {category.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="text-2xl font-bold text-[#2D241E] transition-transform hover:translate-x-2"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          <div className="mt-auto border-t border-[#E5DED4] pt-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8B5E3C]">
              Siguenos en Instagram
            </p>
            <p className="mt-2 text-xs text-[#5C4D42]">@shiny.fitness</p>
          </div>
        </div>
      </div>

      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </>
  )
}
