'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function NewsletterSubscribeForm() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()

    if (!isValidEmail(normalizedEmail)) {
      toast.error('Ingresa un email valido para suscribirte.')
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: normalizedEmail }),
      })

      const data = (await response.json()) as {
        message?: string
        alreadySubscribed?: boolean
      }

      if (!response.ok) {
        throw new Error(data.message || 'No pudimos registrar tu email.')
      }

      if (data.alreadySubscribed) {
        toast.info(data.message || 'Ese email ya estaba suscripto.')
      } else {
        toast.success(data.message || 'Te suscribiste al newsletter.')
      }

      setEmail('')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No pudimos procesar tu suscripcion.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        className="w-full border-b border-[#DCCBC0] bg-transparent py-2 text-sm outline-none placeholder:text-[#B79E89] focus:border-[#2D241E]"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#2D241E] transition-transform hover:translate-x-1 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? 'Suscribiendo...' : 'Suscribirme'}
        <ArrowRight className="h-3 w-3" />
      </button>
    </form>
  )
}
