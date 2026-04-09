import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface LocalCartItem {
  productId: number
  quantity: number
  name: string
  price: number
  image: string
  discountPercent: number
  discountedPrice: number
}

interface LocalCartStore {
  items: LocalCartItem[]
  addItem: (item: LocalCartItem) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalAmount: number
}

export const useLocalCartStore = create<LocalCartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: LocalCartItem) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId)
          if (existing) {
            const updated = state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
            return {
              items: updated,
              totalItems: updated.reduce((sum, i) => sum + i.quantity, 0),
              totalAmount: updated.reduce(
                (sum, i) => sum + (i.discountedPrice || i.price) * i.quantity,
                0
              ),
            }
          }
          const updated = [...state.items, item]
          return {
            items: updated,
            totalItems: updated.reduce((sum, i) => sum + i.quantity, 0),
            totalAmount: updated.reduce(
              (sum, i) => sum + (i.discountedPrice || i.price) * i.quantity,
              0
            ),
          }
        })
      },

      removeItem: (productId: number) => {
        set((state) => {
          const updated = state.items.filter((i) => i.productId !== productId)
          return {
            items: updated,
            totalItems: updated.reduce((sum, i) => sum + i.quantity, 0),
            totalAmount: updated.reduce(
              (sum, i) => sum + (i.discountedPrice || i.price) * i.quantity,
              0
            ),
          }
        })
      },

      updateQuantity: (productId: number, quantity: number) => {
        set((state) => {
          const updated = state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          )
          return {
            items: updated,
            totalItems: updated.reduce((sum, i) => sum + i.quantity, 0),
            totalAmount: updated.reduce(
              (sum, i) => sum + (i.discountedPrice || i.price) * i.quantity,
              0
            ),
          }
        })
      },

      clearCart: () => set({ items: [], totalItems: 0, totalAmount: 0 }),

      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      get totalAmount() {
        return get().items.reduce(
          (sum, i) => sum + (i.discountedPrice || i.price) * i.quantity,
          0
        )
      },
    }),
    {
      name: 'localCart',
    }
  )
)
