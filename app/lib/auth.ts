import 'server-only'

import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SESSION_COOKIE_NAME = 'shiny_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30
const SESSION_SECRET = (() => {
  const secret =
    process.env.AUTH_SECRET ??
    process.env.SESSION_SECRET ??
    process.env.DATABASE_URL

  if (!secret) {
    throw new Error('AUTH_SECRET, SESSION_SECRET, or DATABASE_URL must be configured')
  }

  return secret
})()

type SessionUserPayload = {
  id: string
  name: string | null
  email: string
  role: 'ADMIN' | 'CUSTOMER'
}

function signSessionPayload(payload: string) {
  return createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url')
}

function encodeSessionPayload(user: SessionUserPayload, expiresAt: Date) {
  return Buffer.from(
    JSON.stringify({
      user,
      expiresAt: expiresAt.getTime(),
    })
  ).toString('base64url')
}

function decodeSessionPayload(value: string) {
  try {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as {
      user: SessionUserPayload
      expiresAt: number
    }
  } catch {
    return null
  }
}

function getSessionCookieValue(user: SessionUserPayload, expiresAt: Date) {
  const encodedPayload = encodeSessionPayload(user, expiresAt)
  return `${encodedPayload}.${signSessionPayload(encodedPayload)}`
}

function parseSessionCookie(token: string) {
  const [encodedPayload, signature] = token.split('.')

  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = signSessionPayload(encodedPayload)

  try {
    const signaturesMatch = timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )

    if (!signaturesMatch) {
      return null
    }
  } catch {
    return null
  }

  const parsed = decodeSessionPayload(encodedPayload)

  if (!parsed) {
    return null
  }

  const expiresAt = new Date(parsed.expiresAt)

  if (expiresAt <= new Date()) {
    return null
  }

  return { user: parsed.user, expiresAt }
}

function sanitizeRedirectPath(
  target: string | string[] | undefined,
  fallback = '/cuenta'
) {
  if (typeof target !== 'string' || !target.startsWith('/')) {
    return fallback
  }

  if (target.startsWith('//')) {
    return fallback
  }

  return target
}

function getSessionExpiryDate() {
  return new Date(Date.now() + SESSION_TTL_MS)
}

export async function getAuthSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  try {
    const parsedSession = parseSessionCookie(token)

    if (!parsedSession) {
      return null
    }

    return {
      id: token,
      expiresAt: parsedSession.expiresAt,
      user: parsedSession.user,
    }
  } catch (error) {
    console.error('Error reading auth session:', error)
    return null
  }
}

export async function requireAuth(redirectTo = '/login') {
  const session = await getAuthSession()

  if (!session) {
    redirect(redirectTo)
  }

  return session
}

export async function requireAdmin(redirectTo = '/login?next=/admin') {
  const session = await requireAuth(redirectTo)

  if (session.user.role !== 'ADMIN') {
    redirect('/cuenta')
  }

  return session
}

export async function createAuthSession(user: SessionUserPayload) {
  const expiresAt = getSessionExpiryDate()

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, getSessionCookieValue(user, expiresAt), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  })
}

export async function destroyAuthSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export function getPostLoginRedirect(
  role: 'ADMIN' | 'CUSTOMER',
  nextPath?: string | string[]
) {
  if (role === 'ADMIN') {
    return sanitizeRedirectPath(nextPath, '/admin')
  }

  return sanitizeRedirectPath(nextPath, '/cuenta')
}

export function getSafeRedirect(nextPath?: string | string[], fallback?: string) {
  return sanitizeRedirectPath(nextPath, fallback)
}
