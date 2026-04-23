import { getPaymentMethodLabel } from '@/app/lib/order-payments'
import { formatArs } from '@/app/lib/pricing'
import { siteConfig } from '@/app/lib/seo'

type OrderAlertInput = {
  orderId: string
  externalReference?: string | null
  customerName: string
  customerEmail: string
  total: number | { toString(): string }
  paymentMethod: string | null
  alertType: 'paid' | 'pending_validation'
  source: 'mercadopago' | 'transferencia' | 'gocuotas'
}

function getOrderAlertConfig() {
  const provider = process.env.ORDER_ALERT_PROVIDER?.trim() ?? ''
  const webhookUrl = process.env.ORDER_ALERT_WEBHOOK_URL?.trim() ?? ''
  const enabled = process.env.ORDER_ALERT_ENABLED === 'true'
  const emailRecipients = (process.env.ORDER_ALERT_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  return {
    provider,
    webhookUrl,
    emailRecipients,
    enabled: enabled && provider === 'make_whatsapp' && webhookUrl.length > 0,
  }
}

function getAlertTitle(input: OrderAlertInput) {
  if (input.alertType === 'paid') {
    return 'Nueva compra confirmada'
  }

  if (input.source === 'transferencia') {
    return 'Nuevo pedido por transferencia'
  }

  if (input.source === 'gocuotas') {
    return 'Nuevo pedido por GoCuotas'
  }

  return 'Nuevo pedido registrado'
}

export async function sendOrderAlert(input: OrderAlertInput) {
  const config = getOrderAlertConfig()

  if (!config.enabled) {
    return
  }

  const reference = input.externalReference ?? input.orderId
  const paymentMethod = getPaymentMethodLabel(input.paymentMethod)
  const total = formatArs(input.total)
  const adminUrl = `${siteConfig.url}/admin/pedidos/${input.orderId}`

  const payload = {
    provider: config.provider,
    type: 'order_alert',
    title: getAlertTitle(input),
    status: input.alertType === 'paid' ? 'paid' : 'pending_validation',
    source: input.source,
    orderId: input.orderId,
    externalReference: reference,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    alertEmails: config.emailRecipients,
    alertEmailsCsv: config.emailRecipients.join(','),
    alertEmailPrimary: config.emailRecipients[0] ?? '',
    alertEmailSecondary: config.emailRecipients[1] ?? '',
    paymentMethod,
    total,
    adminUrl,
    message: `${getAlertTitle(input)}\nPedido: ${reference}\nCliente: ${input.customerName}\nEmail: ${input.customerEmail}\nTotal: ${total}\nPago: ${paymentMethod}\nAdmin: ${adminUrl}`,
  }

  try {
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error(
        'Order alert webhook failed:',
        response.status,
        response.statusText
      )
    }
  } catch (error) {
    console.error('Error sending order alert webhook:', error)
  }
}
