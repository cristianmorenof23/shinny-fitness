import { Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Camila R.',
    text: 'Me encantó la calidad de las prendas. Son súper cómodas y el calce es perfecto. Volvería a comprar sin dudar.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Lucía M.',
    text: 'La atención fue excelente y el envío rapidísimo. Además, todo es aún más lindo en persona.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Sofía G.',
    text: 'Los conjuntos son hermosos y súper cómodos para entrenar. Ya tengo varios y los amo.',
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="bg-[#fffaf6] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex max-w-2xl flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b684d]">
            Opiniones
          </span>

          <h2 className="text-3xl font-semibold leading-tight text-[#2f241d] sm:text-4xl">
            Lo que dicen nuestras clientas
          </h2>

          <p className="text-sm leading-7 text-[#6f5b4d] sm:text-base">
            Experiencias reales de mujeres que ya eligieron Shiny.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="group rounded-3xl border border-[#eadfd5] bg-white p-6 shadow-[0_10px_30px_rgba(91,67,50,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(91,67,50,0.1)]"
            >
              {/* Estrellas */}
              <div className="mb-4 flex items-center gap-1 text-[#c59a6c]">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#c59a6c]" />
                ))}
              </div>

              {/* Texto */}
              <p className="text-sm leading-7 text-[#6f5b4d]">
                “{item.text}”
              </p>

              {/* Nombre */}
              <div className="mt-5 text-sm font-semibold text-[#2f241d]">
                {item.name}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}