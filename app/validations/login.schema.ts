import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Ingresa un email valido').trim().toLowerCase(),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
  next: z.string().optional(),
  adminOnly: z.enum(['true', 'false']).optional(),
})

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Ingresa tu nombre'),
    email: z.email('Ingresa un email valido').trim().toLowerCase(),
    password: z
      .string()
      .min(6, 'La contrasena debe tener al menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(6, 'Confirma la contrasena con al menos 6 caracteres'),
    next: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contrasenas no coinciden',
    path: ['confirmPassword'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
