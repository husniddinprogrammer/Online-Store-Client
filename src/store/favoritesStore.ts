import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LocalFavoritesStore {
  productIds: number[]
  toggleFavorite: (productId: number) => void
  isFavorite: (productId: number) => boolean
}

export const useLocalFavoritesStore = create<LocalFavoritesStore>()(
  persist(
    (set, get) => ({
      productIds: [],

      toggleFavorite: (productId: number) => {
        set((state) => {
          const exists = state.productIds.includes(productId)
          return {
            productIds: exists
              ? state.productIds.filter((id) => id !== productId)
              : [...state.productIds, productId],
          }
        })
      },

      isFavorite: (productId: number) => {
        return get().productIds.includes(productId)
      },
    }),
    {
      name: 'localFavorites',
    }
  )
)
