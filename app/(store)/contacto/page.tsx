import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import ContactForm from '@/app/components/contact/contact-form'
import { InstagramIcon } from '@/app/components/icons/social-icons'
import { buildWhatsAppUrl, contactConfig } from '@/app/lib/contact'
import { createMetadata } from '@/app/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Contacto',
  description:
    'Contactate con Shiny Fitness para consultar talles, stock, envios y asesoramiento personalizado desde Cordoba, Argentina.',
  path: '/contacto',
})

export default function ContactPage() {
  const whatsappUrl = buildWhatsAppUrl(
    'Hola Shiny Fitness, quiero hacer una consulta sobre talles, stock o envios.'
  )

  const contactItems = [
    {
      icon: Phone,
      label: 'WhatsApp',
      value: contactConfig.whatsappDisplay,
      href: whatsappUrl,
    },
    {
      icon: Mail,
      label: 'Email',
      value: contactConfig.email,
      href: `mailto:${contactConfig.email}`,
    },
    {
      icon: MapPin,
      label: 'Ubicacion',
      value: contactConfig.location,
    },
    {
      icon: InstagramIcon,
      label: 'Instagram',
      value: contactConfig.instagram,
      href: contactConfig.instagramUrl,
    },
  ]

  return (
    <main className="min-h-screen bg-[#FDFBF9] text-[#2D241E]">
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-16 max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-[#4A3728] px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#FDFBF9]">
            Contacto
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-[#2D241E] md:text-6xl">
            Estamos para ayudarte a encontrar tu{' '}
            <span className="text-[#8B5E3C]">look ideal</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#5C4D42]">
            Si tenes dudas sobre talles, stock o envios, escribinos. Te
            respondemos lo antes posible para que tu compra sea simple y segura.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2.5rem] border border-[#E5DED4] bg-white p-8 shadow-sm md:p-12">
            <h2 className="text-2xl font-bold text-[#2D241E]">
              Envianos un mensaje
            </h2>
            <p className="mt-2 text-[#8B5E3C]">
              Completa el formulario y te responderemos pronto.
            </p>

            <ContactForm />
          </div>

          <div className="space-y-8">
            <div className="rounded-[2.5rem] bg-[#F5F0EB] p-8 md:p-10">
              <h3 className="mb-8 text-xl font-bold text-[#2D241E]">
                Informacion de contacto
              </h3>

              <div className="space-y-6">
                {contactItems.map((item) => {
                  const Icon = item.icon
                  const content = (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#8B5E3C] shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-tighter text-[#8B5E3C]">
                          {item.label}
                        </p>
                        <p className="font-medium text-[#2D241E]">{item.value}</p>
                      </div>
                    </>
                  )

                  return item.href ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      className="flex items-center gap-5 transition hover:translate-x-1"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div key={item.label} className="flex items-center gap-5">
                      {content}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-[#2D241E] p-8 text-[#FDFBF9] shadow-xl">
              <h3 className="text-xl font-bold">Atencion personalizada</h3>
              <p className="mt-4 leading-relaxed text-[#D1C7BD]">
                Dudas con los talles? Escribinos y te asesoramos personalmente.
              </p>
              <Link
                href={whatsappUrl}
                target="_blank"
                className="mt-8 flex items-center justify-center gap-3 rounded-2xl bg-[#8B5E3C] px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#A67B5B]"
              >
                <MessageCircle size={20} />
                Hablar por WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
