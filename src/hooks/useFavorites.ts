import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { favorites as favoritesApi } from '@/services/api/endpoints'
import { useAuthStore } from '@/store/authStore'
import { useLocalFavoritesStore } from '@/store/favoritesStore'

export function useFavoritesQuery() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.getFavorites().then((r) => r.data.data),
    enabled: isLoggedIn,
  })
}

export function useToggleFavorite(productId: number) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const queryClient = useQueryClient()
  const toggleLocal = useLocalFavoritesStore((s) => s.toggleFavorite)
  const isLocalFavorite = useLocalFavoritesStore((s) => s.isFavorite(productId))
  const { data: favoritesData } = useFavoritesQuery()

  const addMutation = useMutation({
    mutationFn: () => favoritesApi.addFavorite(productId).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  })

  const removeMutation = useMutation({
    mutationFn: () => favoritesApi.removeFavorite(productId).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  })

  if (isLoggedIn) {
    // favoritesData is PaginatedData<ProductResponse>
    const isFavorite = favoritesData?.content
      ? favoritesData.content.some((p) => p.id === productId)
      : false

    const toggle = () => {
      if (isFavorite) removeMutation.mutate()
      else addMutation.mutate()
    }

    return {
      isFavorite,
      toggle,
      isLoading: addMutation.isPending || removeMutation.isPending,
    }
  }

  return {
    isFavorite: isLocalFavorite,
    toggle: () => toggleLocal(productId),
    isLoading: false,
  }
}
