import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MapPin, MessageCircle, Phone,  } from 'lucide-react'
import { createMetadata } from '@/app/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Contacto',
  description:
    'Contactate con Shiny Fitness para consultar talles, stock, envios y asesoramiento personalizado desde Cordoba, Argentina.',
  path: '/contacto',
})

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF9] text-[#2D241E]">
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        
        {/* Header Section */}
        <div className="mb-16 max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-[#4A3728] px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#FDFBF9]">
            Contacto
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-[#2D241E] md:text-6xl">
            Estamos para ayudarte a encontrar tu <span className="text-[#8B5E3C]">look ideal</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#5C4D42]">
            Si tenés dudas sobre talles, stock o envíos, escribinos. 
            Te respondemos lo antes posible para que tu compra sea simple y segura.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          
          {/* Formulario */}
          <div className="rounded-[2.5rem] border border-[#E5DED4] bg-white p-8 shadow-sm md:p-12">
            <h2 className="text-2xl font-bold text-[#2D241E]">Envíanos un mensaje</h2>
            <p className="mt-2 text-[#8B5E3C]">Completá el formulario y te responderemos pronto.</p>

            <form className="mt-10 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold uppercase tracking-wider text-[#5C4D42] ml-1">Nombre</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    className="w-full rounded-2xl border border-[#E5DED4] bg-[#FDFBF9] px-5 py-4 outline-none transition focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-semibold uppercase tracking-wider text-[#5C4D42] ml-1">Teléfono</label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="Tu teléfono"
                    className="w-full rounded-2xl border border-[#E5DED4] bg-[#FDFBF9] px-5 py-4 outline-none transition focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold uppercase tracking-wider text-[#5C4D42] ml-1">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="tuemail@email.com"
                  className="w-full rounded-2xl border border-[#E5DED4] bg-[#FDFBF9] px-5 py-4 outline-none transition focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold uppercase tracking-wider text-[#5C4D42] ml-1">Mensaje</label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="¿En qué podemos ayudarte?"
                  className="w-full resize-none rounded-2xl border border-[#E5DED4] bg-[#FDFBF9] px-5 py-4 outline-none transition focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto rounded-2xl bg-[#4A3728] px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#2D241E] shadow-lg shadow-stone-200"
              >
                Enviar consulta
              </button>
            </form>
          </div>

          {/* Sidebar de Información */}
          <div className="space-y-8">
            <div className="rounded-[2.5rem] bg-[#F5F0EB] p-8 md:p-10">
              <h3 className="text-xl font-bold text-[#2D241E] mb-8">Información de contacto</h3>
              
              <div className="space-y-6">
                {[
                  { icon: Phone, label: "WhatsApp", val: "+54 9 351 000 0000" },
                  { icon: Mail, label: "Email", val: "hola@shiny.com.ar" },
                  { icon: MapPin, label: "Ubicación", val: "Córdoba, Argentina" },
                  { icon: Phone, label: "Instagram", val: "@shiny.fitness" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#8B5E3C] shadow-sm">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-tighter text-[#8B5E3C]">{item.label}</p>
                      <p className="font-medium text-[#2D241E]">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA WhatsApp con color tierra oscuro */}
            <div className="rounded-[2.5rem] bg-[#2D241E] p-8 text-[#FDFBF9] shadow-xl">
              <h3 className="text-xl font-bold">Atención personalizada</h3>
              <p className="mt-4 text-[#D1C7BD] leading-relaxed">
                ¿Dudas con los talles? Escribinos y te asesoramos personalmente.
              </p>
              <Link
                href="https://wa.me/5493510000000"
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
