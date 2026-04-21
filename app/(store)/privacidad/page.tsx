import type { Metadata } from 'next'
import { LegalPage } from '@/app/components/legal/legal-page'
import { contactConfig } from '@/app/lib/contact'
import { createMetadata } from '@/app/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Privacidad',
  description:
    'Conoce como Shiny Fitness recopila, utiliza y protege tus datos al navegar, consultar y comprar en la tienda online.',
  path: '/privacidad',
})

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacidad"
      title="Tu informacion se usa para acompanarte mejor"
      description="En Shiny Fitness cuidamos los datos que compartes con nosotras para que tu experiencia de compra sea cercana, clara y segura."
      sections={[
        {
          title: 'Que informacion recopilamos',
          paragraphs: [
            'Podemos recopilar datos que tu misma nos brindas al completar formularios, hacer una compra o escribirnos por WhatsApp o email. Esto puede incluir nombre, correo electronico, telefono, direccion y detalles del pedido.',
            'Tambien podemos registrar informacion tecnica basica del uso del sitio, como paginas visitadas o datos de navegacion, para mejorar el funcionamiento de la tienda y detectar errores.',
          ],
        },
        {
          title: 'Para que usamos tus datos',
          paragraphs: [
            'Usamos tu informacion para responder consultas, procesar compras, coordinar entregas, confirmar pagos y brindarte seguimiento postventa cuando sea necesario.',
            'Tambien podemos utilizar esos datos para mejorar la experiencia del sitio, organizar pedidos, prevenir inconvenientes y mantener una comunicacion clara durante el proceso de compra.',
          ],
        },
        {
          title: 'Pagos, terceros y seguridad',
          paragraphs: [
            'Los pagos online pueden procesarse mediante plataformas de terceros como Mercado Pago o GoCuotas. Esos servicios gestionan parte de la informacion financiera bajo sus propias politicas de privacidad y seguridad.',
            'Shiny Fitness no almacena datos completos de tarjetas en la tienda. Conservamos solo la informacion necesaria para identificar el pedido, verificar su estado y ofrecer soporte comercial.',
          ],
        },
        {
          title: 'Contacto y actualizaciones',
          paragraphs: [
            `Si necesitas revisar, corregir o consultar informacion relacionada con tus datos, puedes escribirnos a ${contactConfig.email} o por WhatsApp al ${contactConfig.whatsappDisplay}.`,
            'Esta politica puede actualizarse cuando cambien nuestros procesos, medios de pago o canales de atencion. La version publicada en esta web sera la que se considere vigente.',
          ],
        },
      ]}
      closing="Trabajamos para que comprar en Shiny Fitness sea una experiencia comoda y segura. Si tienes cualquier duda sobre privacidad o el uso de tus datos, escribinos y te ayudamos personalmente."
    />
  )
}
