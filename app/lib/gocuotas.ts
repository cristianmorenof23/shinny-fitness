import 'server-only'

export type GoCuotasMode = 'disabled' | 'payment_link' | 'api'

export type GoCuotasConfig = {
  enabled: boolean
  mode: GoCuotasMode
  installments: number
  paymentLinkUrl: string | null
  merchantId: string | null
  publicKey: string | null
  apiKey: string | null
  secretKey: string | null
}

function normalizeMode(value?: string | null): GoCuotasMode {
  if (value === 'payment_link' || value === 'api') {
    return value
  }

  return 'disabled'
}

function normalizePaymentLink(value?: string | null) {
  const rawValue = value?.trim()

  if (!rawValue) {
    return 'https://gocuotas.com/206133'
  }

  if (/^https?:\/\//i.test(rawValue)) {
    return rawValue
  }

  if (rawValue.startsWith('gocuotas.com/')) {
    return `https://${rawValue}`
  }

  if (/^\d+$/.test(rawValue)) {
    return `https://gocuotas.com/${rawValue}`
  }

  return rawValue
}

export function getGoCuotasConfig(): GoCuotasConfig {
  const rawMode = normalizeMode(process.env.GOCUOTAS_MODE)
  const installments = Number(process.env.GOCUOTAS_INSTALLMENTS ?? '3')
  const paymentLinkUrl = normalizePaymentLink(
    process.env.GOCUOTAS_PAYMENT_LINK_URL
  )
  const merchantId = process.env.GOCUOTAS_MERCHANT_ID ?? null
  const publicKey = process.env.GOCUOTAS_PUBLIC_KEY ?? null
  const apiKey = process.env.GOCUOTAS_API_KEY ?? null
  const secretKey = process.env.GOCUOTAS_SECRET_KEY ?? null
  const mode =
    rawMode === 'disabled' && paymentLinkUrl ? 'payment_link' : rawMode

  const enabled =
    mode === 'payment_link'
      ? Boolean(paymentLinkUrl)
      : mode === 'api'
        ? Boolean(merchantId && (apiKey || secretKey))
        : false

  return {
    enabled,
    mode,
    installments: Number.isFinite(installments) && installments > 0 ? installments : 3,
    paymentLinkUrl,
    merchantId,
    publicKey,
    apiKey,
    secretKey,
  }
}

export function getGoCuotasCheckoutState() {
  const config = getGoCuotasConfig()

  if (!config.enabled) {
    return {
      enabled: false,
      mode: config.mode,
      installments: config.installments,
      badge: 'Proximamente',
      description:
        'Dejamos visible esta opcion para comunicar medios de pago disponibles y activar la integracion real apenas GoCuotas confirme credenciales y modalidad.',
    } as const
  }

  return {
    enabled: true,
    mode: config.mode,
    installments: config.installments,
    badge: 'Disponible',
    description:
      config.mode === 'payment_link'
        ? `GoCuotas esta disponible mediante su plataforma externa para ${config.installments} cuotas. El pedido queda registrado antes de redirigir.`
        : `GoCuotas esta listo para una integracion custom en ${config.installments} cuotas.`,
  } as const
}
