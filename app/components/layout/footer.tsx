import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-[#e7d9cc] bg-[#f6efe8] text-[#4b3425]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Marca */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block text-2xl font-semibold tracking-[0.18em] text-[#4b3425] transition hover:opacity-80"
          >
            SHINY
          </Link>

          <p className="max-w-xs text-sm leading-7 text-[#6f5b4d]">
            Ropa deportiva femenina seleccionada para acompañarte con estilo,
            comodidad y actitud en cada día.
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8b684d]">
            Navegación
          </h3>

          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link
                href="/"
                className="transition duration-300 hover:text-[#8b684d]"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/productos"
                className="transition duration-300 hover:text-[#8b684d]"
              >
                Productos
              </Link>
            </li>
            <li>
              <Link
                href="/contacto"
                className="transition duration-300 hover:text-[#8b684d]"
              >
                Contacto
              </Link>
            </li>
            <li>
              <Link
                href="/sobre-mi"
                className="transition duration-300 hover:text-[#8b684d]"
              >
                Sobre mí
              </Link>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8b684d]">
            Contacto
          </h3>

          <ul className="mt-4 space-y-4 text-sm text-[#6f5b4d]">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-[#7b5a43]" />
              <span>+54 9 351 000 0000</span>
            </li>

            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-[#7b5a43]" />
              <span>hola@shiny.com.ar</span>
            </li>

            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-[#7b5a43]" />
              <span>Córdoba, Argentina</span>
            </li>

            <li>
              <Link
                href="https://instagram.com"
                target="_blank"
                className="inline-flex items-center gap-2 transition duration-300 hover:text-[#8b684d]"
              >
                <Mail className="h-4 w-4 text-[#7b5a43]" />
                Instagram
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8b684d]">
            Newsletter
          </h3>

          <p className="mt-4 text-sm leading-7 text-[#6f5b4d]">
            Recibí novedades, lanzamientos y productos destacados de Shiny.
          </p>

          <form className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <input
              type="email"
              placeholder="Tu email"
              className="h-11 w-full rounded-full border border-[#dbc7b6] bg-white px-4 text-sm text-[#3e2d21] outline-none transition-all duration-300 placeholder:text-[#9c8776] focus:border-[#a27b5c] focus:shadow-md"
            />

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#7b5a43] px-5 text-sm font-medium text-white transition-all duration-300 hover:bg-[#6b4d39]"
            >
              Suscribirme
            </button>
          </form>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-[#e7d9cc]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-[#8a7666] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Shiny. Todos los derechos reservados.</p>

          <div className="flex gap-4">
            <Link href="/politica-de-privacidad" className="hover:text-[#6b4f3a] transition">
              Privacidad
            </Link>
            <Link href="/terminos-y-condiciones" className="hover:text-[#6b4f3a] transition">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}