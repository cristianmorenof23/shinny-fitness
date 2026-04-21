import type { Metadata } from 'next'
import { LegalPage } from '@/app/components/legal/legal-page'
import { contactConfig } from '@/app/lib/contact'
import { createMetadata } from '@/app/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Términos',
  description:
    'Revisa las condiciones generales de uso, compra, pagos y stock en la tienda online de Shiny Fitness.',
  path: '/terminos',
})

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terminos"
      title="Condiciones claras para comprar con confianza"
      description="Estas condiciones ordenan el uso de la tienda online y explican como manejamos productos, precios, pagos y soporte para que tu compra sea transparente."
      sections={[
        {
          title: 'Uso general del sitio',
          paragraphs: [
            'Al navegar por Shiny Fitness o realizar una compra, aceptas utilizar el sitio de forma responsable, brindando informacion real y evitando acciones que afecten el funcionamiento normal de la tienda.',
            'El contenido del sitio, incluyendo imagenes, textos, descripciones y elementos visuales de marca, forma parte de la identidad comercial de Shiny Fitness.',
          ],
        },
        {
          title: 'Productos, precios y stock',
          paragraphs: [
            'Cada producto puede contar con variantes de color, talle y stock. Aunque trabajamos para mantener la informacion actualizada, la disponibilidad final siempre queda sujeta a confirmacion al momento de procesar el pedido.',
            'Los precios publicados pueden modificarse sin previo aviso. En caso de un error manifiesto de precio, stock o configuracion, podremos contactarte para corregirlo, ofrecer una alternativa o cancelar la compra si fuera necesario.',
          ],
        },
        {
          title: 'Medios de pago y confirmacion',
          paragraphs: [
            'La tienda puede ofrecer medios de pago como Mercado Pago, GoCuotas o transferencia bancaria, segun disponibilidad. Cada opcion puede tener validaciones, aprobaciones o tiempos propios del proveedor externo.',
            'Un pedido se considera correctamente ingresado cuando queda registrado en la tienda. La confirmacion final del pago puede depender del medio elegido y de revisiones manuales o automaticas posteriores.',
          ],
        },
        {
          title: 'Postventa, cambios y soporte',
          paragraphs: [
            'Si surge una duda con tu pedido, pago, envio o disponibilidad, nos pondremos en contacto por los datos que nos hayas compartido o podras escribirnos directamente por WhatsApp o email.',
            'Los cambios, revisiones o soluciones posteriores a la compra se gestionan caso por caso, sujetos a stock disponible, estado del producto y coordinacion directa con el equipo de Shiny Fitness.',
          ],
        },
      ]}
      closing={`Si necesitas asistencia antes o despues de comprar, puedes escribirnos a ${contactConfig.email} o por WhatsApp al ${contactConfig.whatsappDisplay}. Queremos que todo el proceso sea simple y bien acompanado.`}
    />
  )
}
