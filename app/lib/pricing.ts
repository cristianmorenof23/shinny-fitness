export function getInstallmentPrice(
  amount: number | string | { toString(): string },
  installments = 3
) {
  return Math.round(Number(amount) / installments)
}

export function formatArs(
  amount: number | string | { toString(): string },
  maximumFractionDigits = 0
) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits,
  }).format(Number(amount))
}
