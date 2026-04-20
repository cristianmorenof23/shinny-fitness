'use client'

import { ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/app/store/cart-store'

type AddToCartButtonProps = {
  product: {
    id: string
    name: string
    slug: string
    price: number
    image: string
    selectedSize?: string
    selectedColor?: string
  }
  className?: string
  label?: string
  disabled?: boolean
}

export function AddToCartButton({
  product,
  className,
  label = 'Agregar al carrito',
  disabled,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem)

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        addItem({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.image,
          selectedSize: product.selectedSize ?? 'Unico',
          selectedColor: product.selectedColor ?? 'Unico',
        })

        toast.success(`${product.name} se agrego al carrito.`)
      }}
      className={className}
    >
      <span className="inline-flex items-center gap-2">
        <ShoppingBag className="h-4 w-4" />
        {label}
      </span>
    </button>
  )
}
