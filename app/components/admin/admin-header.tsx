'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink, Plus } from 'lucide-react'

const pageTitles: Record<string, { title: string; description: string }> = {
  '/admin': {
    title: 'Panel administrativo',
    description: 'Visualiza y administra el estado general de la tienda.',
  },
  '/admin/productos': {
    title: 'Productos',
    description: 'Edita el catalogo y crea nuevos productos.',
  },
  '/admin/categorias': {
    title: 'Categorias',
    description: 'Organiza el catalogo por categorias.',
  },
  '/admin/pedidos': {
    title: 'Pedidos',
    description: 'Haz seguimiento de compras y estados de entrega.',
  },
  '/admin/banners': {
    title: 'Banners',
    description: 'Controla la comunicacion visual de la home.',
  },
  '/admin/reseñas': {
    title: 'Resenas',
    description: 'Gestiona testimonios y prueba social.',
  },
}

function getHeaderContent(pathname: string) {
  if (pathname.startsWith('/admin/productos')) {
    return pageTitles['/admin/productos']
  }

  if (pathname.startsWith('/admin/categorias')) {
    return pageTitles['/admin/categorias']
  }

  if (pathname.startsWith('/admin/pedidos')) {
    return pageTitles['/admin/pedidos']
  }

  if (pathname.startsWith('/admin/banners')) {
    return pageTitles['/admin/banners']
  }

  if (pathname.startsWith('/admin/reseñas')) {
    return pageTitles['/admin/reseñas']
  }

  return pageTitles['/admin']
}

export default function AdminHeader() {
  const pathname = usePathname()
  const content = getHeaderContent(pathname)

  return (
    <header className="border-b border-neutral-200 bg-white/95 px-4 py-4 backdrop-blur md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Administracion
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
            {content.title}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">{content.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            <ExternalLink className="h-4 w-4" />
            Ver tienda
          </Link>

          <Link
            href="/admin/productos/nuevo"
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Link>
        </div>
      </div>
    </header>
  )
}
