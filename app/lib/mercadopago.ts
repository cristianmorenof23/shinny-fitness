import 'server-only'

import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'

function getAccessToken() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN

  if (!token) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN is not configured')
  }

  return token
}

export function getMercadoPagoClient() {
  return new MercadoPagoConfig({
    accessToken: getAccessToken(),
  })
}

export function getMercadoPagoPreferenceClient() {
  return new Preference(getMercadoPagoClient())
}

export function getMercadoPagoPaymentClient() {
  return new Payment(getMercadoPagoClient())
}
