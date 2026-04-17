import { CreditCard, Headset, RefreshCcw, Truck } from 'lucide-react'

const benefits = [
  {
    id: 1,
    icon: Truck,
    title: 'Envíos a todo el país',
    description:
      'Recibí tus prendas favoritas donde estés, de forma rápida y segura.',
  },
  {
    id: 2,
    icon: CreditCard,
    title: '3 cuotas sin interés',
    description:
      'Comprá de forma más cómoda y llevate tus looks favoritos sin complicarte.',
  },
  {
    id: 3,
    icon: RefreshCcw,
    title: 'Cambios simples',
    description:
      'Si necesitás otro talle o querés hacer un cambio, el proceso es fácil y claro.',
  },
  {
    id: 4,
    icon: Headset,
    title: 'Atención personalizada',
    description:
      'Te ayudamos a encontrar lo que mejor vaya con vos y resolver cualquier duda.',
  },
]

export function StoreBenefits() {
  return (
    <section className="bg-[#fcf8f4] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex max-w-2xl flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b684d]">
            Beneficios de comprar en Shiny
          </span>

          <h2 className="text-3xl font-semibold leading-tight text-[#2f241d] sm:text-4xl">
            Una experiencia de compra simple, cómoda y pensada para vos
          </h2>

          <p className="text-sm leading-7 text-[#6f5b4d] sm:text-base">
            Queremos que comprar tu ropa deportiva favorita sea tan lindo como
            usarla.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <article
                key={benefit.id}
                className="group rounded-3xl border border-[#eadfd5] bg-[#fffaf6] p-6 shadow-[0_10px_30px_rgba(91,67,50,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(91,67,50,0.1)]"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3e6dc] text-[#6b4f3a] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#ead7c8]">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-semibold text-[#2f241d]">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#6f5b4d]">
                  {benefit.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}