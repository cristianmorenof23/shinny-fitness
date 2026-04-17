import { Star, Quote } from 'lucide-react'

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
    <section className="bg-[#FDFBF9] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado centrado para variar el ritmo visual */}
        <div className="mb-16 flex flex-col items-center text-center">
          <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B5E3C]">
            Comunidad Shiny
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-[#2D241E] sm:text-5xl">
            Lo que dicen <span className="italic font-serif text-[#8B5E3C]">nuestras clientas</span>
          </h2>
          <div className="mt-4 h-1 w-12 rounded-full bg-[#E5DED4]"></div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="relative flex flex-col justify-between rounded-[2.5rem] border border-[#E5DED4] bg-white p-10 transition-all duration-500 hover:shadow-xl hover:shadow-[#4A3728]/5"
            >
              {/* Icono de comilla decorativo */}
              <Quote className="absolute right-10 top-10 h-8 w-8 text-[#F5F0EB]" />

              <div className="relative">
                {/* Estrellas en oro viejo */}
                <div className="mb-6 flex items-center gap-1 text-[#D4AF37]">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#D4AF37]" />
                  ))}
                </div>

                {/* Texto del testimonio */}
                <p className="text-base italic leading-relaxed text-[#5C4D42]">
                  “{item.text}”
                </p>
              </div>

              {/* Autor con línea decorativa */}
              <div className="mt-8 flex items-center gap-3">
                <div className="h-px w-6 bg-[#8B5E3C]"></div>
                <span className="text-sm font-bold tracking-widest uppercase text-[#2D241E]">
                  {item.name}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}