import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string
  name: string
  slug: string
  price: number
  image: string
  quantity: number

  // 🔥 NUEVO
  selectedSize: string
  selectedColor: string
}

type CartStore = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string, size: string, color: string) => void
  increaseQuantity: (id: string, size: string, color: string) => void
  decreaseQuantity: (id: string, size: string, color: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // 🔥 ADD ITEM CORREGIDO
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (product) =>
              product.id === item.id &&
              product.selectedSize === item.selectedSize &&
              product.selectedColor === item.selectedColor
          )

          if (existingItem) {
            return {
              items: state.items.map((product) =>
                product.id === item.id &&
                product.selectedSize === item.selectedSize &&
                product.selectedColor === item.selectedColor
                  ? { ...product, quantity: product.quantity + 1 }
                  : product
              ),
            }
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          }
        }),

      // 🔥 REMOVE
      removeItem: (id, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.id === id &&
                item.selectedSize === size &&
                item.selectedColor === color
              )
          ),
        })),

      // 🔥 INCREASE
      increaseQuantity: (id, size, color) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id &&
            item.selectedSize === size &&
            item.selectedColor === color
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        })),

      // 🔥 DECREASE
      decreaseQuantity: (id, size, color) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id &&
              item.selectedSize === size &&
              item.selectedColor === color
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        )
      },
    }),
    {
      name: 'shiny-cart',
    }
  )
)
