export type ParsedProductImageMeta = {
  color: string
  alt: string
}

const COLOR_PREFIX = 'color='
const ALT_SEPARATOR = '||alt='

export function parseProductImageAlt(value?: string | null): ParsedProductImageMeta {
  const normalized = value?.trim() ?? ''

  if (!normalized.startsWith(COLOR_PREFIX) || !normalized.includes(ALT_SEPARATOR)) {
    return {
      color: '',
      alt: normalized,
    }
  }

  const withoutPrefix = normalized.slice(COLOR_PREFIX.length)
  const separatorIndex = withoutPrefix.indexOf(ALT_SEPARATOR)

  if (separatorIndex === -1) {
    return {
      color: '',
      alt: normalized,
    }
  }

  return {
    color: withoutPrefix.slice(0, separatorIndex).trim(),
    alt: withoutPrefix.slice(separatorIndex + ALT_SEPARATOR.length).trim(),
  }
}

export function buildProductImageAlt({
  color,
  alt,
}: {
  color?: string | null
  alt?: string | null
}) {
  const normalizedColor = color?.trim() ?? ''
  const normalizedAlt = alt?.trim() ?? ''

  if (!normalizedColor) {
    return normalizedAlt
  }

  return `${COLOR_PREFIX}${normalizedColor}${ALT_SEPARATOR}${normalizedAlt}`
}
