import type { Metadata } from 'next'

export const siteConfig = {
  name: 'Shiny Fitness',
  shortName: 'Shiny',
  url: 'https://shiny-fitness.com',
  titleTemplate: '%s | Shiny Fitness',
  description:
    'Shiny Fitness es una tienda online de ropa deportiva femenina con prendas premium, looks versatiles y una experiencia de compra cercana.',
  ogImage: '/banner.png',
  locale: 'es_AR',
  creator: 'Shiny Fitness',
  publisher: 'Shiny Fitness',
  keywords: [
    'Shiny Fitness',
    'ropa deportiva femenina',
    'indumentaria fitness mujer',
    'ropa deportiva online',
    'calzas deportivas',
    'tops deportivos',
    'shorts deportivos',
    'conjuntos fitness',
    'tienda fitness argentina',
  ],
} as const

export const publicRobots: NonNullable<Metadata['robots']> = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
}

export const noIndexRobots: NonNullable<Metadata['robots']> = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
    'max-image-preview': 'none',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
}

type MetadataOptions = {
  title?: string
  description?: string
  path?: string
  image?: string
  noIndex?: boolean
  keywords?: string[]
  type?: 'website' | 'article'
}

function normalizePath(path = '/') {
  if (!path || path === '/') return '/'
  return path.startsWith('/') ? path : `/${path}`
}

export function absoluteUrl(path = '/') {
  return new URL(normalizePath(path), siteConfig.url).toString()
}

function resolveImage(image?: string) {
  const resolved = image ?? siteConfig.ogImage
  if (resolved.startsWith('http://') || resolved.startsWith('https://')) {
    return resolved
  }

  return absoluteUrl(resolved)
}

export function truncateDescription(
  value: string | null | undefined,
  fallback = siteConfig.description,
  maxLength = 160
) {
  const normalized = (value ?? fallback).replace(/\s+/g, ' ').trim()

  if (normalized.length <= maxLength) {
    return normalized
  }

  return `${normalized.slice(0, maxLength - 3).trimEnd()}...`
}

export function createMetadata({
  title,
  description = siteConfig.description,
  path = '/',
  image,
  noIndex = false,
  keywords,
  type = 'website',
}: MetadataOptions = {}): Metadata {
  const canonicalPath = normalizePath(path)
  const resolvedImage = resolveImage(image)

  return {
    title,
    description,
    keywords: keywords ?? [...siteConfig.keywords],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type,
      locale: siteConfig.locale,
      url: canonicalPath,
      siteName: siteConfig.name,
      title: title ?? siteConfig.name,
      description,
      images: [
        {
          url: resolvedImage,
          alt: `${siteConfig.name} portada`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title ?? siteConfig.name,
      description,
      images: [resolvedImage],
    },
    robots: noIndex ? noIndexRobots : publicRobots,
  }
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  applicationName: siteConfig.name,
  category: 'fashion',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: absoluteUrl(siteConfig.ogImage),
        alt: `${siteConfig.name} portada`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [absoluteUrl(siteConfig.ogImage)],
  },
  robots: publicRobots,
}
