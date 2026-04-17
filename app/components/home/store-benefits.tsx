import { CreditCard, Headset, RefreshCcw, Truck } from 'lucide-react'

const benefits = [
  {
    id: 1,
    icon: Truck,
    title: 'Envíos a todo el país',
    description: 'Recibí tus prendas favoritas donde estés, de forma rápida y segura.',
  },
  {
    id: 2,
    icon: CreditCard,
    title: '3 cuotas sin interés',
    description: 'Comprá de forma más cómoda y llevate tus looks favoritos sin complicaciones.',
  },
  {
    id: 3,
    icon: RefreshCcw,
    title: 'Cambios simples',
    description: 'Si necesitás otro talle o querés hacer un cambio, el proceso es fácil y claro.',
  },
  {
    id: 4,
    icon: Headset,
    title: 'Atención personalizada',
    description: 'Te ayudamos a encontrar lo que mejor vaya con vos y resolvemos cualquier duda.',
  },
]

export function StoreBenefits() {
  return (
    <section className="bg-[#FDFBF9] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="mb-16 flex max-w-3xl flex-col gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B5E3C]">
            Experiencia Shiny
          </span>

          <h2 className="text-4xl font-bold leading-[1.15] text-[#2D241E] sm:text-5xl">
            Tu comodidad es nuestra <span className="italic font-serif text-[#8B5E3C]">prioridad</span>
          </h2>

          <p className="max-w-xl text-base leading-relaxed text-[#5C4D42]">
            Queremos que comprar tu ropa deportiva sea tan gratificante como 
            el momento en que te la probás por primera vez.
          </p>
        </div>

        {/* Grid de Beneficios */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <article
                key={benefit.id}
                className="group relative rounded-[2.5rem] border border-[#E5DED4] bg-white p-8 transition-all duration-500 hover:bg-[#F5F0EB] hover:shadow-xl hover:shadow-[#4A3728]/5"
              >
                {/* Icono con estilo "Soft" */}
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F5F0EB] text-[#8B5E3C] transition-all duration-500 group-hover:bg-white group-hover:rotate-10 group-hover:shadow-md">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="text-xl font-bold text-[#2D241E]">
                  {benefit.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-[#5C4D42]">
                  {benefit.description}
                </p>

                {/* Decoración sutil de fondo al hover */}
                <div className="absolute right-6 top-6 h-2 w-2 rounded-full bg-[#E5DED4] opacity-0 transition-opacity group-hover:opacity-100" />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}