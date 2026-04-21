import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type LegalSection = {
  title: string
  paragraphs: string[]
}

export function LegalPage({
  eyebrow,
  title,
  description,
  sections,
  closing,
}: {
  eyebrow: string
  title: string
  description: string
  sections: LegalSection[]
  closing: string
}) {
  return (
    <main className="min-h-screen bg-[#FDFBF9] text-[#2D241E]">
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2.5rem] border border-[#E5DED4] bg-white p-8 shadow-sm md:p-12">
            <span className="inline-flex rounded-full bg-[#4A3728] px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#FDFBF9]">
              {eyebrow}
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#2D241E] md:text-6xl">
              {title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#5C4D42]">
              {description}
            </p>
          </div>

          <div className="mt-10 space-y-6">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-[2rem] border border-[#E5DED4] bg-white p-8 shadow-sm"
              >
                <h2 className="text-2xl font-bold text-[#2D241E]">
                  {section.title}
                </h2>

                <div className="mt-5 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-base leading-8 text-[#5C4D42]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-[2rem] bg-[#F5F0EB] p-8">
            <p className="text-base leading-8 text-[#4A3728]">{closing}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/productos"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#4A3728] px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#2D241E]"
              >
                Ver productos
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center rounded-2xl border border-[#DCCBC0] px-6 py-4 text-sm font-bold uppercase tracking-widest text-[#2D241E] transition hover:bg-white"
              >
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
