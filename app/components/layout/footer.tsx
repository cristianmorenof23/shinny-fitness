import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-[#E5DED4] bg-[#FDFBF9] text-[#2D241E]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Marca y Propuesta de Valor */}
          <div className="space-y-6">
            <Link
              href="/"
              className="inline-block text-2xl font-bold tracking-[0.2em] text-[#4A3728] transition hover:opacity-80"
            >
              SHINY
            </Link>
            <p className="max-w-xs text-sm leading-7 text-[#5C4D42]">
              Ropa deportiva femenina seleccionada para mujeres que buscan el equilibrio perfecto entre 
              <strong> rendimiento y estilo</strong>.
            </p>
            {/* Redes Sociales Rápidas */}
            <div className="flex gap-4">
              <Link href="https://instagram.com" className="group rounded-full border border-[#E5DED4] p-2 transition hover:bg-[#F5F0EB]">
                <Phone className="h-4 w-4 text-[#8B5E3C]" />
              </Link>
              <Link href="#" className="group rounded-full border border-[#E5DED4] p-2 transition hover:bg-[#F5F0EB]">
                <Mail className="h-4 w-4 text-[#8B5E3C]" />
              </Link>
            </div>
          </div>

          {/* Navegación - Diseño Minimalista */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B5E3C]">
              Explorar
            </h3>
            <ul className="mt-6 space-y-4 text-sm">
              {['Inicio', 'Productos', 'Contacto', 'Sobre mí'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="relative text-[#5C4D42] transition duration-300 hover:text-[#4A3728] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#8B5E3C] after:transition-all hover:after:w-full"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Datos de contacto con iconos curados */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B5E3C]">
              Contacto
            </h3>
            <ul className="mt-6 space-y-5 text-sm text-[#5C4D42]">
              <li className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F0EB]">
                  <Phone className="h-3.5 w-3.5 text-[#8B5E3C]" />
                </div>
                <span>+54 9 351 000 0000</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F0EB]">
                  <Mail className="h-3.5 w-3.5 text-[#8B5E3C]" />
                </div>
                <span>hola@shiny.com.ar</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F0EB]">
                  <MapPin className="h-3.5 w-3.5 text-[#8B5E3C]" />
                </div>
                <span>Córdoba, Argentina</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Estilo Boutique */}
          <div className="rounded-4xl bg-[#F5F0EB] p-6 lg:p-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#4A3728]">
              Únete al Club
            </h3>
            <p className="mt-3 text-xs leading-5 text-[#6F5B4D]">
              Recibe lanzamientos exclusivos y consejos de bienestar.
            </p>
            <form className="mt-6 space-y-3">
              <input
                type="email"
                placeholder="Tu email"
                className="w-full rounded-xl border border-[#E5DED4] bg-white px-4 py-3 text-xs outline-none transition-all focus:border-[#8B5E3C]"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#4A3728] py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#2D241E]"
              >
                Suscribirme
              </button>
            </form>
          </div>
        </div>

        {/* Créditos Finales */}
        <div className="mt-16 border-t border-[#E5DED4] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-[10px] font-medium uppercase tracking-widest text-[#8B5E3C]">
              © {new Date().getFullYear()} Shiny Fitness. Diseñado con ♡ para mujeres reales.
            </p>
            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-[#5C4D42]">
              <Link href="/privacidad" className="hover:text-[#8B5E3C] transition">Privacidad</Link>
              <Link href="/terminos" className="hover:text-[#8B5E3C] transition">Términos</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}