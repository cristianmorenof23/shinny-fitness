'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/app/store/cart-store'

export function ClearCartOnSuccess() {
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return null
}
