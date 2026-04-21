import type { Metadata } from 'next'
import { LegalPage } from '@/app/components/legal/legal-page'
import { contactConfig } from '@/app/lib/contact'
import { createMetadata } from '@/app/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Envíos',
  description:
    'Consulta como coordina Shiny Fitness los envios, seguimiento y entrega de los pedidos realizados desde la tienda online.',
  path: '/envios',
})

export default function ShippingPage() {
  return (
    <LegalPage
      eyebrow="Envios"
      title="Cada entrega se coordina de forma cercana"
      description="En Shiny Fitness los envios se organizan personalmente para ayudarte a elegir la mejor opcion segun tu pedido, ubicacion y medio de pago."
      sections={[
        {
          title: 'Como se coordina el envio',
          paragraphs: [
            'Una vez realizado el pago, el envio se coordina por WhatsApp con el equipo de Shiny Fitness. Esto nos permite confirmar datos, disponibilidad y modalidad de entrega de una forma mas cercana.',
            `Para seguimiento y coordinacion utilizamos principalmente el WhatsApp ${contactConfig.whatsappDisplay}, donde tambien puedes compartir comprobantes o consultar el estado de tu pedido.`,
          ],
        },
        {
          title: 'Tiempos y cobertura',
          paragraphs: [
            'Los tiempos de despacho y entrega pueden variar segun la ciudad, el volumen de pedidos, la empresa de transporte y la disponibilidad de cada producto o variante.',
            'Los plazos informados son estimados y no constituyen una promesa cerrada. Siempre haremos lo posible por mantenerte al tanto del estado de tu pedido.',
          ],
        },
        {
          title: 'Costos y seguimiento',
          paragraphs: [
            'Salvo que se indique lo contrario, el costo de envio no esta incluido en el precio del producto y se define al momento de coordinar la entrega.',
            'El seguimiento del pedido se realiza por WhatsApp, donde tambien podremos confirmar datos de envio, horarios y cualquier observacion importante sobre la entrega.',
          ],
        },
        {
          title: 'Cambios y coordinacion posterior',
          paragraphs: [
            'Si necesitas modificar un dato del envio o consultar una alternativa de entrega, puedes hacerlo escribiendonos apenas se confirme el pago para ayudarte antes del despacho.',
            'Las gestiones posteriores, incluyendo cambios sujetos a disponibilidad o revisiones de compra, se atienden de manera personalizada para encontrar la mejor solucion.',
          ],
        },
      ]}
      closing="Queremos que recibas tu compra de la forma mas comoda posible. Si tienes dudas sobre el envio antes o despues de pagar, escribinos por WhatsApp y lo coordinamos juntas."
    />
  )
}
