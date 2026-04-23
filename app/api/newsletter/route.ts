import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string }
    const email = body.email?.trim().toLowerCase() ?? ''

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Ingresa un email valido.' },
        { status: 400 }
      )
    }

    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existingSubscriber) {
      if (!existingSubscriber.isActive) {
        await prisma.newsletterSubscriber.update({
          where: { id: existingSubscriber.id },
          data: { isActive: true },
        })
      }

      return NextResponse.json({
        alreadySubscribed: true,
        message: 'Ese email ya estaba suscripto al newsletter.',
      })
    }

    await prisma.newsletterSubscriber.create({
      data: { email },
    })

    return NextResponse.json({
      message: 'Te sumaste al Club Shiny con exito.',
    })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)

    return NextResponse.json(
      { message: 'No pudimos registrar tu suscripcion ahora.' },
      { status: 500 }
    )
  }
}
