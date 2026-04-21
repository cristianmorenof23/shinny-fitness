type PaymentMethod = string | null | undefined
type OrderStatus = string | null | undefined

export function getPaymentMethodLabel(paymentMethod: PaymentMethod) {
  switch (paymentMethod) {
    case 'mercadopago':
      return 'Mercado Pago'
    case 'gocuotas':
      return 'GoCuotas'
    case 'transferencia':
      return 'Transferencia'
    default:
      return 'Sin metodo'
  }
}

export function getPaymentStatusMeta(input: {
  paymentMethod: PaymentMethod
  orderStatus: OrderStatus
  mercadopagoStatus?: string | null
}) {
  const { paymentMethod, orderStatus, mercadopagoStatus } = input

  if (paymentMethod === 'mercadopago') {
    switch (mercadopagoStatus) {
      case 'approved':
        return {
          label: 'Cobro aprobado',
          className: 'bg-emerald-100 text-emerald-700',
        }
      case 'pending':
      case 'in_process':
        return {
          label: 'Cobro pendiente',
          className: 'bg-amber-100 text-amber-700',
        }
      case 'rejected':
      case 'cancelled':
      case 'failure':
        return {
          label: 'Cobro rechazado',
          className: 'bg-red-100 text-red-700',
        }
      default:
        return {
          label: 'Sin novedad',
          className: 'bg-neutral-100 text-neutral-700',
        }
    }
  }

  if (paymentMethod === 'gocuotas') {
    if (orderStatus === 'PAID') {
      return {
        label: 'Validado manualmente',
        className: 'bg-emerald-100 text-emerald-700',
      }
    }

    if (orderStatus === 'CANCELLED') {
      return {
        label: 'Operacion cancelada',
        className: 'bg-red-100 text-red-700',
      }
    }

    return {
      label: 'Pendiente de validacion',
      className: 'bg-amber-100 text-amber-700',
    }
  }

  if (paymentMethod === 'transferencia') {
    if (orderStatus === 'PAID') {
      return {
        label: 'Transferencia confirmada',
        className: 'bg-emerald-100 text-emerald-700',
      }
    }

    if (orderStatus === 'CANCELLED') {
      return {
        label: 'Operacion cancelada',
        className: 'bg-red-100 text-red-700',
      }
    }

    return {
      label: 'Esperando comprobante',
      className: 'bg-amber-100 text-amber-700',
    }
  }

  return {
    label: 'Sin novedad',
    className: 'bg-neutral-100 text-neutral-700',
  }
}
