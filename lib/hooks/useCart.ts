import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cart as cartApi } from '@/lib/api/endpoints'
import type { AddToCartPayload, UpdateCartItemPayload } from '@/lib/api/endpoints'
import { useAuthStore } from '@/lib/store/authStore'

export function useCartQuery() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.getCart().then((r) => r.data.data),
    enabled: isLoggedIn,
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddToCartPayload) =>
      cartApi.addToCart(payload).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: number) =>
      cartApi.removeCartItem(itemId).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: number
      payload: UpdateCartItemPayload
    }) => cartApi.updateCartItem(itemId, payload).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export function useClearCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => cartApi.clearCart().then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}
