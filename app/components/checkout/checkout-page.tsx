'use client'

import { useMemo, useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  BadgePercent,
  CheckCircle2,
  CreditCard,
  Landmark,
  LoaderCircle,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { buildWhatsAppUrl } from '@/app/lib/contact'
import {
  getTransferDiscountAmount,
  getTransferSavingsAmount,
  transferConfig,
} from '@/app/lib/payments'
import { formatArs, getInstallmentPrice } from '@/app/lib/pricing'
import { useCartStore } from '@/app/store/cart-store'

type CheckoutResponse = {
  initPoint?: string
  checkoutUrl?: string
  error?: string
}

type CheckoutPaymentMethod = 'mercadopago' | 'gocuotas' | 'transferencia'

type GoCuotasCheckoutState = {
  enabled: boolean
  mode: 'disabled' | 'payment_link' | 'api'
  installments: number
  badge: string
  description: string
}

function formatVariantLabel(color?: string, size?: string, quantity?: number) {
  const parts = [color, size].filter(Boolean)
  const base = parts.length > 0 ? parts.join(' - ') : 'Sin variante'
  return quantity ? `${base} - x${quantity}` : base
}

export function CheckoutPageClient({
  goCuotas,
}: {
  goCuotas: GoCuotasCheckoutState
}) {
  const items = useCartStore((state) => state.items)
  const total = useCartStore((state) => state.getTotalPrice())
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPaymentMethod>('mercadopago')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  })

  const installmentPrice = useMemo(() => getInstallmentPrice(total), [total])
  const transferTotal = useMemo(() => getTransferDiscountAmount(total), [total])
  const transferSavings = useMemo(() => getTransferSavingsAmount(total), [total])
  const finalTotal = paymentMethod === 'transferencia' ? transferTotal : total

  function updateField(field: keyof typeof customer, value: string) {
    setCustomer((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (items.length === 0) {
      const message = 'Tu carrito esta vacio.'
      setErrorMessage(message)
      toast.error(message)
      return
    }

    setErrorMessage(null)

    startTransition(async () => {
      try {
        const endpoint =
          paymentMethod === 'gocuotas'
            ? '/api/gocuotas/checkout'
            : paymentMethod === 'transferencia'
              ? '/api/transfer/checkout'
              : '/api/mercadopago/preference'

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer,
            paymentMethod,
            items: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              selectedSize: item.selectedSize,
              selectedColor: item.selectedColor,
            })),
          }),
        })

        const data = (await response.json()) as CheckoutResponse

        const redirectUrl = data.initPoint ?? data.checkoutUrl

        if (!response.ok || !redirectUrl) {
          const message =
            data.error ?? 'No pudimos iniciar el checkout. Intenta nuevamente.'
          setErrorMessage(message)
          toast.error(message)
          return
        }

        toast.success(
          paymentMethod === 'gocuotas'
            ? 'Redirigiendo a GoCuotas...'
            : paymentMethod === 'transferencia'
              ? 'Mostrando instrucciones para transferencia...'
            : 'Redirigiendo a Mercado Pago...'
        )
        window.location.href = redirectUrl
      } catch (error) {
        console.error('Error starting checkout:', error)
        const message =
          'No pudimos conectar con el checkout. Revisa tu conexion e intenta de nuevo.'
        setErrorMessage(message)
        toast.error(message)
      }
    })
  }

  return (
    <main className="min-h-[70vh] bg-[#fcf8f4] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b684d]">
            Checkout
          </span>
          <h1 className="mt-3 text-3xl font-semibold text-[#2f241d] sm:text-4xl">
            Completa tus datos y elige como pagar
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[28px] border border-[#eadfd5] bg-white p-10 text-center shadow-[0_10px_30px_rgba(91,67,50,0.05)]">
            <h2 className="text-2xl font-semibold text-[#2f241d]">
              Tu carrito esta vacio
            </h2>
            <p className="mt-3 text-sm text-[#6f5b4d]">
              Agrega productos antes de continuar al checkout.
            </p>

            <Link
              href="/productos"
              className="mt-6 inline-flex rounded-full bg-[#7b5a43] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#6b4d39]"
            >
              Ir al catalogo
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-[28px] border border-[#eadfd5] bg-white p-6 shadow-[0_10px_30px_rgba(91,67,50,0.05)]"
            >
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-[#2f241d]">
                  Datos de contacto
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    required
                    value={customer.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    placeholder="Nombre y apellido"
                    className="rounded-2xl border border-[#ddccbd] bg-[#fffaf6] px-4 py-3 text-sm outline-none transition focus:border-[#8b684d]"
                  />
                  <input
                    required
                    type="email"
                    value={customer.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    placeholder="Email"
                    className="rounded-2xl border border-[#ddccbd] bg-[#fffaf6] px-4 py-3 text-sm outline-none transition focus:border-[#8b684d]"
                  />
                  <input
                    value={customer.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    placeholder="Telefono"
                    className="rounded-2xl border border-[#ddccbd] bg-[#fffaf6] px-4 py-3 text-sm outline-none transition focus:border-[#8b684d]"
                  />
                  <input
                    value={customer.address}
                    onChange={(event) => updateField('address', event.target.value)}
                    placeholder="Direccion de entrega"
                    className="rounded-2xl border border-[#ddccbd] bg-[#fffaf6] px-4 py-3 text-sm outline-none transition focus:border-[#8b684d]"
                  />
                </div>

                <textarea
                  rows={4}
                  value={customer.notes}
                  onChange={(event) => updateField('notes', event.target.value)}
                  placeholder="Notas del pedido"
                  className="w-full resize-none rounded-2xl border border-[#ddccbd] bg-[#fffaf6] px-4 py-3 text-sm outline-none transition focus:border-[#8b684d]"
                />
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-[#2f241d]">
                  Metodo de pago
                </h2>

                <label className="flex cursor-pointer items-start gap-4 rounded-3xl border border-[#ddccbd] p-5 transition hover:border-[#8b684d]">
                  <input
                    type="radio"
                    checked={paymentMethod === 'mercadopago'}
                    onChange={() => setPaymentMethod('mercadopago')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-[#4b3425]" />
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-[#2f241d]">Mercado Pago</p>
                        <Image
                          src="/mercado_pago.png"
                          alt="Mercado Pago"
                          width={110}
                          height={28}
                          className="h-7 w-auto object-contain"
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-[#6f5b4d]">
                      Redirecciona a Checkout Pro para pagar con tarjeta, dinero en
                      cuenta o medios habilitados por Mercado Pago.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-4 rounded-3xl border p-5 transition ${
                    goCuotas.enabled
                      ? 'cursor-pointer border-[#ddccbd] hover:border-[#8b684d]'
                      : 'border-dashed border-[#ddccbd] bg-[#fffaf6]'
                  }`}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === 'gocuotas'}
                    onChange={() => {
                      if (goCuotas.enabled) {
                        setPaymentMethod('gocuotas')
                      }
                    }}
                    disabled={!goCuotas.enabled}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-[#4b3425]" />
                      <div className="flex items-center gap-3">
                        <Image
                          src="/go_cuotas.png"
                          alt="Go Cuotas"
                          width={110}
                          height={28}
                          className="h-7 w-auto object-contain"
                        />
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                            goCuotas.enabled
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-[#f1e5da] text-[#8b684d]'
                          }`}
                        >
                          {goCuotas.badge}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-[#6f5b4d]">
                      {goCuotas.description}
                    </p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-[#8b684d]">
                      Referencia comercial: {goCuotas.installments} cuotas sin interes
                    </p>
                    {goCuotas.enabled ? (
                      <p className="mt-3 text-xs leading-6 text-[#6f5b4d]">
                        Seras redirigida a GoCuotas para completar el pago. Tu
                        pedido quedara registrado como pendiente hasta validar la
                        operacion.
                      </p>
                    ) : null}
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-4 rounded-3xl border border-[#ddccbd] p-5 transition hover:border-[#8b684d]">
                  <input
                    type="radio"
                    checked={paymentMethod === 'transferencia'}
                    onChange={() => setPaymentMethod('transferencia')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Landmark className="h-5 w-5 text-[#4b3425]" />
                      <div>
                        <p className="font-semibold text-[#2f241d]">
                          Transferencia bancaria
                        </p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                          {transferConfig.discountPercentage}% OFF inmediato
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-[#6f5b4d]">
                      Abonas por transferencia y te respetamos el descuento al
                      instante. Alias para el pago: <span className="font-semibold text-[#2f241d]">{transferConfig.alias}</span>.
                    </p>
                  </div>
                </label>
              </section>

              {errorMessage ? (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isPending}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#7b5a43] px-5 py-4 text-sm font-medium text-white transition-all duration-300 hover:bg-[#6b4d39] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Iniciando checkout
                  </span>
                ) : (
                  'Pagar ahora'
                )}
              </button>
            </form>

            <aside className="h-fit rounded-[28px] border border-[#eadfd5] bg-white p-6 shadow-[0_10px_30px_rgba(91,67,50,0.05)]">
              <h3 className="text-xl font-semibold text-[#2f241d]">
                Resumen de compra
              </h3>

              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex items-center justify-between gap-4 border-b border-[#f0e6dc] pb-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#2f241d]">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#6f5b4d]">
                        {formatVariantLabel(
                          item.selectedColor,
                          item.selectedSize,
                          item.quantity
                        )}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[#2f241d]">
                      {formatArs(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4 text-sm text-[#6f5b4d]">
                <div className="rounded-2xl border border-[#eadfd5] bg-[#fffaf6] px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b684d]">
                    Medios destacados
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <Image
                      src="/mercado_pago.png"
                      alt="Mercado Pago"
                      width={110}
                      height={28}
                      className="h-7 w-auto object-contain"
                    />
                    <Image
                      src="/go_cuotas.png"
                      alt="Go Cuotas"
                      width={110}
                      height={28}
                      className={`h-7 w-auto object-contain ${
                        goCuotas.enabled ? '' : 'opacity-75'
                      }`}
                    />
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#ddccbd] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b4d39]">
                      <Landmark className="h-3.5 w-3.5" />
                      Transferencia
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#2f241d]">
                    {formatArs(total)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Envio</span>
                  <span className="font-medium text-[#2f241d]">A coordinar</span>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                    Transferencia bancaria
                  </p>
                  <p className="mt-2 text-sm text-[#2f241d]">
                    {transferConfig.discountPercentage}% OFF pagando al alias{' '}
                    <span className="font-semibold">{transferConfig.alias}</span>
                  </p>
                  <p className="mt-2 text-xs text-emerald-800">
                    Ahorras {formatArs(transferSavings)} y te queda en{' '}
                    <span className="font-semibold">{formatArs(transferTotal)}</span>
                  </p>
                </div>

                <div className="rounded-2xl bg-[#fcf3ec] px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b684d]">
                    Cuotas
                  </p>
                  <p className="mt-2 text-sm text-[#4b3425]">
                    Referencia visual: {goCuotas.installments} pagos de{' '}
                    <span className="font-semibold">
                      {formatArs(
                        paymentMethod === 'gocuotas' && goCuotas.installments > 0
                          ? total / goCuotas.installments
                          : installmentPrice
                      )}
                    </span>
                  </p>
                  {goCuotas.enabled ? (
                    <p className="mt-2 inline-flex items-center gap-2 text-xs text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      GoCuotas habilitado para esta tienda
                    </p>
                  ) : null}
                </div>

                <div className="border-t border-[#eadfd5] pt-4">
                  {paymentMethod === 'transferencia' ? (
                    <div className="mb-4 rounded-2xl bg-[#fffaf6] px-4 py-3 text-sm text-[#6f5b4d]">
                      <p className="inline-flex items-center gap-2 text-[#4b3425]">
                        <BadgePercent className="h-4 w-4" />
                        El total ya contempla el {transferConfig.discountPercentage}% OFF por transferencia.
                      </p>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-[#2f241d]">
                      Total
                    </span>
                    <span className="text-base font-semibold text-[#2f241d]">
                      {formatArs(finalTotal)}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-[#dccbbc] px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b684d]">
                    Envio
                  </p>
                  <p className="mt-2 text-sm text-[#6f5b4d]">
                    El envio se coordina por WhatsApp una vez acreditado el pago.
                  </p>
                  <a
                    href={buildWhatsAppUrl(
                      'Hola Shiny Fitness, quiero consultar el envio de mi compra.'
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#4A3728] transition hover:text-[#8B5E3C]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Consultar por WhatsApp
                  </a>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
