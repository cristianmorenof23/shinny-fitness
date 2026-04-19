'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { Role } from '../../generated/prisma/enums'
import { prisma } from '@/app/lib/prisma'
import {
  createAuthSession,
  destroyAuthSession,
  getPostLoginRedirect,
  getSafeRedirect,
} from '@/app/lib/auth'
import { loginSchema, registerSchema } from '@/app/validations/login.schema'

export type AuthActionState = {
  formError?: string
  fieldErrors?: Record<string, string[] | undefined>
}

export async function loginUserAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    next: formData.get('next') ?? undefined,
    adminOnly: formData.get('adminOnly') ?? 'false',
  })

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  let user

  try {
    user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    })
  } catch (error) {
    console.error('Error loading user for login:', error)
    return {
      formError:
        'No pudimos conectar con la base de datos para iniciar sesion. Revisa el acceso remoto de MySQL y las migraciones pendientes.',
    }
  }

  if (!user) {
    return {
      formError: 'No encontramos una cuenta con ese email.',
    }
  }

  const passwordMatches = await bcrypt.compare(
    parsed.data.password,
    user.password
  )

  if (!passwordMatches) {
    return {
      formError: 'La contrasena ingresada no es correcta.',
    }
  }

  if (parsed.data.adminOnly === 'true' && user.role !== 'ADMIN') {
    return {
      formError: 'Tu cuenta no tiene permisos para ingresar al panel admin.',
    }
  }

  try {
    await createAuthSession(user.id)
  } catch (error) {
    console.error('Error creating auth session:', error)
    return {
      formError:
        'No pudimos crear tu sesion. Reinicia el servidor y vuelve a intentar.',
    }
  }

  redirect(getPostLoginRedirect(user.role, parsed.data.next))
}

export async function registerUserAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    next: formData.get('next') ?? undefined,
  })

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  let existingUser

  try {
    existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    })
  } catch (error) {
    console.error('Error checking existing user:', error)
    return {
      formError:
        'No pudimos conectar con la base de datos para crear tu cuenta. Revisa el acceso remoto de MySQL y las migraciones pendientes.',
    }
  }

  if (existingUser) {
    return {
      formError: 'Ya existe una cuenta con ese email.',
    }
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 10)

  let user

  try {
    user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashedPassword,
        role: Role.CUSTOMER,
      },
      select: {
        id: true,
        role: true,
      },
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return {
      formError:
        'No pudimos crear tu cuenta. Si agregaste el rol CUSTOMER al schema, falta aplicar la migracion en la base.',
    }
  }

  try {
    await createAuthSession(user.id)
  } catch (error) {
    console.error('Error creating auth session after register:', error)
    return {
      formError:
        'La cuenta se creo, pero no pudimos iniciar tu sesion automaticamente. Reinicia el servidor e intenta ingresar manualmente.',
    }
  }

  redirect(getPostLoginRedirect(user.role, parsed.data.next))
}

export async function logoutUserAction() {
  await destroyAuthSession()
  redirect('/')
}

export async function logoutToLoginAction() {
  await destroyAuthSession()
  redirect('/login')
}

export async function loginAdminAction(
  prevState: AuthActionState,
  formData: FormData
) {
  formData.set('adminOnly', 'true')
  if (!formData.get('next')) {
    formData.set('next', '/admin')
  }

  return loginUserAction(prevState, formData)
}

export async function getAuthRedirectAfterLogout(next?: string | string[]) {
  return getSafeRedirect(next, '/')
}
