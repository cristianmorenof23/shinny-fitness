'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { buildWhatsAppUrl } from '@/app/lib/contact'

type FormState = {
  name: string
  phone: string
  email: string
  message: string
}

const initialState: FormState = {
  name: '',
  phone: '',
  email: '',
  message: '',
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState)

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.name.trim() || !form.message.trim()) {
      toast.error('Completa tu nombre y consulta para poder enviarla.')
      return
    }

    const message = [
      'Hola Shiny Fitness, quiero hacer una consulta.',
      '',
      `Nombre: ${form.name.trim()}`,
      form.phone.trim() ? `Telefono: ${form.phone.trim()}` : null,
      form.email.trim() ? `Email: ${form.email.trim()}` : null,
      '',
      `Consulta: ${form.message.trim()}`,
    ]
      .filter(Boolean)
      .join('\n')

    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer')
    toast.success('Te abrimos WhatsApp para enviar la consulta.')
    setForm(initialState)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="ml-1 text-sm font-semibold uppercase tracking-wider text-[#5C4D42]"
          >
            Nombre
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Tu nombre"
            className="w-full rounded-2xl border border-[#E5DED4] bg-[#FDFBF9] px-5 py-4 outline-none transition focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="ml-1 text-sm font-semibold uppercase tracking-wider text-[#5C4D42]"
          >
            Telefono
          </label>
          <input
            id="phone"
            type="text"
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            placeholder="Tu telefono"
            className="w-full rounded-2xl border border-[#E5DED4] bg-[#FDFBF9] px-5 py-4 outline-none transition focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="ml-1 text-sm font-semibold uppercase tracking-wider text-[#5C4D42]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          placeholder="tuemail@email.com"
          className="w-full rounded-2xl border border-[#E5DED4] bg-[#FDFBF9] px-5 py-4 outline-none transition focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="ml-1 text-sm font-semibold uppercase tracking-wider text-[#5C4D42]"
        >
          Mensaje
        </label>
        <textarea
          id="message"
          rows={5}
          value={form.message}
          onChange={(event) => updateField('message', event.target.value)}
          placeholder="En que podemos ayudarte?"
          className="w-full resize-none rounded-2xl border border-[#E5DED4] bg-[#FDFBF9] px-5 py-4 outline-none transition focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-[#4A3728] px-10 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-stone-200 transition hover:bg-[#2D241E] sm:w-auto"
      >
        Enviar consulta
      </button>
    </form>
  )
}
