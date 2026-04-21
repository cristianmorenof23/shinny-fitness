import Link from 'next/link'

type SearchValue = string | string[] | undefined

type AdminPaginationProps = {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  basePath: string
  searchParams?: Record<string, SearchValue>
  itemLabel: string
}

function buildHref(
  basePath: string,
  currentParams: Record<string, SearchValue>,
  nextPage: number
) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(currentParams)) {
    if (key === 'page') {
      continue
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        if (entry) {
          params.append(key, entry)
        }
      }
      continue
    }

    if (value) {
      params.set(key, value)
    }
  }

  if (nextPage > 1) {
    params.set('page', String(nextPage))
  }

  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

function getVisiblePages(page: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (page <= 3) {
    return [1, 2, 3, 4, totalPages]
  }

  if (page >= totalPages - 2) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, page - 1, page, page + 1, totalPages]
}

export default function AdminPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  basePath,
  searchParams = {},
  itemLabel,
}: AdminPaginationProps) {
  if (totalItems === 0 || totalPages <= 1) {
    return null
  }

  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalItems)
  const visiblePages = getVisiblePages(page, totalPages)

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-neutral-600">
        Mostrando <span className="font-semibold text-neutral-900">{startItem}</span>{' '}
        a <span className="font-semibold text-neutral-900">{endItem}</span> de{' '}
        <span className="font-semibold text-neutral-900">{totalItems}</span>{' '}
        {itemLabel}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={buildHref(basePath, searchParams, Math.max(1, page - 1))}
          aria-disabled={page <= 1}
          className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition ${
            page <= 1
              ? 'pointer-events-none border border-neutral-200 text-neutral-400'
              : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          Anterior
        </Link>

        {visiblePages.map((visiblePage, index) => {
          const previousPage = visiblePages[index - 1]
          const showEllipsis =
            typeof previousPage === 'number' && visiblePage - previousPage > 1

          return (
            <div key={visiblePage} className="flex items-center gap-2">
              {showEllipsis ? (
                <span className="px-1 text-sm text-neutral-400">...</span>
              ) : null}

              <Link
                href={buildHref(basePath, searchParams, visiblePage)}
                className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-medium transition ${
                  visiblePage === page
                    ? 'bg-neutral-900 text-white'
                    : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {visiblePage}
              </Link>
            </div>
          )
        })}

        <Link
          href={buildHref(basePath, searchParams, Math.min(totalPages, page + 1))}
          aria-disabled={page >= totalPages}
          className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition ${
            page >= totalPages
              ? 'pointer-events-none border border-neutral-200 text-neutral-400'
              : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          Siguiente
        </Link>
      </div>
    </div>
  )
}
