const CONTACT_PHONE_RAW = '+54 9 351 000 0000'

export const contactConfig = {
  whatsappDisplay: CONTACT_PHONE_RAW,
  whatsappNumber: '5493510000000',
  email: 'hola@shiny.com.ar',
  instagram: '@shiny.fitness',
  instagramUrl: 'https://instagram.com/shiny.fitness',
  location: 'Cordoba, Argentina',
} as const

export function buildWhatsAppUrl(message?: string) {
  const baseUrl = `https://wa.me/${contactConfig.whatsappNumber}`
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl
}
