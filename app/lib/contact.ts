const CONTACT_PHONE_RAW = '+54 9 351 209-1800'
const DEVELOPER_PHONE_RAW = '+54 9 351 333-6631'

export const contactConfig = {
  whatsappDisplay: CONTACT_PHONE_RAW,
  whatsappNumber: '5493512091800',
  email: 'shinyfitnessport@gmail.com',
  instagram: '@shiny.fitness',
  instagramUrl: 'https://instagram.com/shiny.fitness',
  location: 'Cordoba, Argentina',
  developerCreditName: 'Cristian Moreno',
  developerWhatsappDisplay: DEVELOPER_PHONE_RAW,
  developerWhatsappNumber: '5493513336631',
} as const

export function buildWhatsAppUrl(message?: string) {
  const baseUrl = `https://wa.me/${contactConfig.whatsappNumber}`
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl
}

export function buildDeveloperWhatsAppUrl(message?: string) {
  const baseUrl = `https://wa.me/${contactConfig.developerWhatsappNumber}`
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl
}
