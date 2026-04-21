export const transferConfig = {
  discountPercentage: 20,
  alias: 'Sabri.meana',
} as const

export function getTransferDiscountAmount(
  amount: number | string | { toString(): string }
) {
  const numericAmount = Number(amount)
  const discountMultiplier =
    1 - transferConfig.discountPercentage / 100

  return Math.round(numericAmount * discountMultiplier)
}

export function getTransferSavingsAmount(
  amount: number | string | { toString(): string }
) {
  const numericAmount = Number(amount)
  return Math.round(numericAmount - getTransferDiscountAmount(numericAmount))
}
