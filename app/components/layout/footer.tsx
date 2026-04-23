import Link from 'next/link'
import { ArrowRight, Mail, MapPin, Phone, Sparkles } from 'lucide-react'
import { BrandLogo } from '@/app/components/brand/brand-logo'
import { InstagramIcon } from '@/app/components/icons/social-icons'
import { NewsletterSubscribeForm } from '@/app/components/layout/newsletter-subscribe-form'
import {
  buildDeveloperWhatsAppUrl,
  buildWhatsAppUrl,
  contactConfig,
} from '@/app/lib/contact'

const quickLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/productos', label: 'Productos' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/sobre-mi', label: 'Sobre mi' },
]

const contactItems = [
  {
    icon: Phone,
    label: 'WhatsApp',
    value: contactConfig.whatsappDisplay,
    href: buildWhatsAppUrl(),
  },
  {
    icon: Mail,
    label: 'Email',
    value: contactConfig.email,
    href: `mailto:${contactConfig.email}`,
  },
]

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[#E5DED4] bg-[#FDFBF9] text-[#2D241E]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[3rem] bg-[#2D241E] text-white shadow-2xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#8B5E3C]/20 blur-[80px]" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#4A3728]/40 blur-[80px]" />

          <div className="relative grid gap-10 px-8 py-12 md:px-12 lg:grid-cols-[1.4fr_0.6fr] lg:py-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37]">
                <Sparkles className="h-3.5 w-3.5" />
                Moverse con Estilo
              </div>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
                Eleva tu entrenamiento a una{' '}
                <span className="font-serif italic text-[#D4AF37]">
                  experiencia
                </span>{' '}
                superior.
              </h2>
            </div>

            <div className="flex flex-col justify-center">
              <div className="rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
                <p className="text-sm leading-relaxed text-[#D9CEC4]">
                  Unite a nuestra comunidad y descubri prendas nuevas,
                  lanzamientos y novedades de Shiny antes que nadie.
                </p>
                <Link
                  href="/productos"
                  className="group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#2D241E] transition-all hover:bg-[#D4AF37] hover:text-white"
                >
                  Explorar catalogo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <BrandLogo width={188} height={58} />
            <p className="text-sm leading-8 text-[#5C4D42]">
              Boutique deportiva pensada para mujeres que transforman su energia
              en movimiento. Calidad premium en cada costura.
            </p>
            <div className="flex gap-4">
              <a
                href={`mailto:${contactConfig.email}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5DED4] transition-colors hover:bg-[#2D241E] hover:text-white"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href={contactConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram de Shiny Fitness"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5DED4] transition-colors hover:bg-[#2D241E] hover:text-white"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B5E3C]">
              Navegacion
            </h4>
            <ul className="mt-8 space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm font-medium text-[#4A3728] transition-colors hover:text-[#8B5E3C]"
                  >
                    <span className="h-px w-0 bg-[#8B5E3C] transition-all group-hover:mr-2 group-hover:w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B5E3C]">
              Contacto directo
            </h4>
            <div className="mt-8 space-y-6">
              {contactItems.map((item) => (
                <a key={item.label} href={item.href} className="group block">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#B79E89]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-[#2D241E] underline-offset-4 group-hover:underline">
                    {item.value}
                  </p>
                </a>
              ))}
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#8B5E3C]" />
                <p className="text-sm text-[#2D241E]">
                  Showroom en Cordoba, Argentina.
                  <br />
                  <span className="text-[10px] text-[#B79E89]">
                    Atencion con cita previa.
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-[#F5F0EB] p-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B5E3C]">
              Newsletter
            </h4>
            <p className="mt-4 text-sm font-bold text-[#2D241E]">
              Sumate al Club Shiny.
            </p>
            <NewsletterSubscribeForm />
          </div>
        </section>

        <section className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-[#E5DED4] pt-8 md:flex-row">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#B79E89]">
            © {new Date().getFullYear()} Shiny Fitness - hecha por{' '}
            <a
              href={buildDeveloperWhatsAppUrl(
                'Hola Cristian, vi tu trabajo en Shiny Fitness y queria consultarte por una web.'
              )}
              target="_blank"
              rel="noreferrer"
              className="text-[#6B4D39] transition hover:text-[#2D241E]"
            >
              {contactConfig.developerCreditName}
            </a>
            .
          </p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-[#2D241E]">
            <Link href="/privacidad" className="hover:text-[#8B5E3C]">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-[#8B5E3C]">
              Términos
            </Link>
            <Link href="/envios" className="hover:text-[#8B5E3C]">
              Envíos
            </Link>
          </div>
        </section>
      </div>
    </footer>
  )
}
