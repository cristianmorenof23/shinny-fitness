import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, ShieldCheck, Sparkles } from 'lucide-react'
import { createMetadata } from '@/app/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Sobre mi',
  description:
    'Conoce la historia de Shiny Fitness, una marca pensada para mujeres que buscan ropa deportiva femenina con estilo, comodidad y atencion cercana.',
  path: '/sobre-mi',
})

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF9] text-[#2D241E]">
      
      {/* Hero Section: Historia y Propósito */}
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-2 lg:items-center">
        <div className="order-2 lg:order-1">
          <span className="mb-4 inline-block rounded-full bg-[#E5DED4] px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#8B5E3C]">
            Sobre Shiny
          </span>

          <h1 className="text-4xl font-bold tracking-tight text-[#2D241E] md:text-6xl lg:leading-[1.1]">
            Una marca para mujeres que eligen <span className="text-[#8B5E3C]">sentirse bien</span>
          </h1>

          <div className="mt-8 space-y-6 text-lg leading-relaxed text-[#5C4D42]">
            <p>
              En Shiny creemos que la ropa deportiva no solo debe acompañarte en el
              entrenamiento, sino potenciar tu seguridad. Seleccionamos
              prendas que equilibran <strong>estilo, confort y versatilidad</strong>.
            </p>

            <p className="text-base italic border-l-4 border-[#8B5E3C] pl-6 text-[#8B5E3C]">
              Elegimos cada prenda pensando en mujeres reales, con rutinas reales, 
              que buscan verse bien y sentirse aún mejor.
            </p>

            <p>
              Queremos que cada compra sea una experiencia cercana. No solo vendemos ropa, 
              ofrecemos las herramientas para que te muevas con total libertad.
            </p>
          </div>

          <Link
            href="/products"
            className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-[#4A3728] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#2D241E] shadow-lg shadow-stone-200"
          >
            Ver catálogo
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Imagen con detalle visual de "marco" */}
        <div className="order-1 lg:order-2 relative">
          <div className="absolute -bottom-6 -right-6 h-full w-full rounded-[3rem] border-2 border-[#E5DED4] lg:block hidden"></div>
          <div className="relative aspect-4/5 overflow-hidden rounded-[3rem] bg-[#F5F0EB] shadow-2xl">
            <Image
              src="/about_image.png"
              alt="Shiny Fitness Lifestyle"
              width={800}
              height={1000}
              className="h-full w-full object-cover grayscale-20 hover:grayscale-0 transition-all duration-700"
            />
          </div>
          {/* Badge decorativo */}
          <div className="absolute -top-4 -left-4 rounded-full bg-white p-6 shadow-xl hidden md:block">
            <Sparkles className="h-8 w-8 text-[#8B5E3C]" />
          </div>
        </div>
      </section>

      {/* Valores / Características */}
      <section className="mx-auto max-w-6xl px-4 pb-24 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          
          {[
            {
              icon: Sparkles,
              title: "Estilo con identidad",
              desc: "Seleccionamos prendas con una estética femenina y moderna para acompañarte dentro y fuera del gym."
            },
            {
              icon: Heart,
              title: "Comodidad real",
              desc: "Tejidos suaves y cortes ergonómicos para que te sientas segura y libre en cada movimiento."
            },
            {
              icon: ShieldCheck,
              title: "Atención cercana",
              desc: "Asesoramiento personalizado en cada talle para que tu experiencia sea perfecta de principio a fin."
            }
          ].map((feature, idx) => (
            <div key={idx} className="group rounded-[2.5rem] border border-[#E5DED4] bg-white p-10 transition-all hover:bg-[#F5F0EB] hover:shadow-md">
              <div className="mb-6 inline-flex rounded-2xl bg-[#FDFBF9] p-4 text-[#8B5E3C] shadow-sm transition-colors group-hover:bg-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-[#2D241E]">{feature.title}</h2>
              <p className="mt-4 text-base leading-relaxed text-[#5C4D42]">
                {feature.desc}
              </p>
            </div>
          ))}

        </div>
      </section>
    </main>
  )
}
