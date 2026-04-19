'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FolderOpen,
  ImageIcon,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
} from 'lucide-react'
import { LogoutButton } from '@/app/components/auth/logout-button'

const navItems = [
  {
    href: '/admin',
    label: 'Resumen',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/productos',
    label: 'Productos',
    icon: Package,
  },
  {
    href: '/admin/categorias',
    label: 'Categorias',
    icon: FolderOpen,
  },
  {
    href: '/admin/pedidos',
    label: 'Pedidos',
    icon: ShoppingCart,
  },
  {
    href: '/admin/banners',
    label: 'Banners',
    icon: ImageIcon,
  },
  {
    href: '/admin/reseñas',
    label: 'Resenas',
    icon: Star,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="border-r border-neutral-200 bg-white">
      <div className="sticky top-0 flex h-full flex-col">
        <div className="border-b border-neutral-200 px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Panel
          </p>
          <h2 className="mt-2 text-xl font-semibold text-neutral-900">Shiny Admin</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Gestiona catalogo, pedidos y contenido de la tienda.
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-5">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === item.href
                : pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-neutral-200 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
            >
              Volver a la tienda
            </Link>
            <LogoutButton label="Salir" />
          </div>
        </div>
      </div>
    </aside>
  )
}
