import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  users,
  addresses,
  orders as ordersApi,
  notifications as notificationsApi,
  reviews as reviewsApi,
  comments as commentsApi,
} from '@/services/api/endpoints'
import { useAuthStore } from '@/store/authStore'

// ── User ──────────────────────────────────────────────────────────────────────

export function useMe() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  return useQuery({
    queryKey: ['me'],
    queryFn: () => users.getMe().then((r) => r.data.data),
    enabled: isLoggedIn,
    staleTime: 0,
  })
}

export function useUpdateMe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: {
      name: string
      surname: string
      phoneNumber?: string
      birthdayAt?: string
    }) => users.updateMe(payload).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: { oldPassword: string; newPassword: string }) =>
      users.changePassword(payload).then((r) => r.data),
  })
}

export function useTopUp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (amount: number) => users.topUp(amount).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

// ── Addresses ─────────────────────────────────────────────────────────────────

export function useAddresses() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => addresses.getAddresses().then((r) => r.data.data),
    enabled: isLoggedIn,
  })
}

export function useCreateAddress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: {
      regionType: string
      cityType: string
      homeNumber: string
      roomNumber: string
    }) => addresses.createAddress(payload).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

export function useUpdateAddress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: {
        regionType: string
        cityType: string
        homeNumber: string
        roomNumber: string
      }
    }) => addresses.updateAddress(id, payload).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

export function useDeleteAddress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => addresses.deleteAddress(id).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

// ── Orders ────────────────────────────────────────────────────────────────────

export function useMyOrders(params?: { status?: string; page?: number; size?: number }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  return useQuery({
    queryKey: ['myOrders', params],
    queryFn: () => ordersApi.getMyOrders(params).then((r) => r.data.data),
    enabled: isLoggedIn,
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => ordersApi.cancelOrder(id).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] })
    },
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { addressId: number }) =>
      ordersApi.createOrder(payload).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['me'] })
      queryClient.invalidateQueries({ queryKey: ['myOrders'] })
    },
  })
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export function useMyReviews(params?: { page?: number; size?: number }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  return useQuery({
    queryKey: ['myReviews', params],
    queryFn: () => reviewsApi.getMyReviews(params).then((r) => r.data.data),
    enabled: isLoggedIn,
    staleTime: 0,
  })
}

export function usePendingReviews(params?: { page?: number; size?: number }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  return useQuery({
    queryKey: ['pendingReviews', params],
    queryFn: () => reviewsApi.getPendingReviews(params).then((r) => r.data.data),
    enabled: isLoggedIn,
    staleTime: 0,
  })
}

export function useReviewEligibility(productId: number) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  return useQuery({
    queryKey: ['reviewEligibility', productId],
    queryFn: () => reviewsApi.getEligibility(productId).then((r) => r.data.data),
    enabled: isLoggedIn && !!productId,
    staleTime: 0,
  })
}

export function useSubmitReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { productId: number; rating: number; text: string }) =>
      commentsApi.addComment(payload).then((r) => r.data.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['myReviews'] })
      queryClient.invalidateQueries({ queryKey: ['pendingReviews'] })
      queryClient.invalidateQueries({
        queryKey: ['reviewEligibility', variables.productId],
      })
      queryClient.invalidateQueries({ queryKey: ['comments', variables.productId] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] })
    },
  })
}

// ── Notifications ─────────────────────────────────────────────────────────────

export function useNotifications(params?: { page?: number; size?: number }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationsApi.getNotifications(params).then((r) => r.data.data),
    enabled: isLoggedIn,
  })
}

export function useUnseenCount() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  return useQuery({
    queryKey: ['unseenCount'],
    queryFn: () => notificationsApi.getUnseenCount().then((r) => r.data.data),
    enabled: isLoggedIn,
    refetchInterval: 30_000,
  })
}

export function useMarkSeen() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => notificationsApi.markSeen(id).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unseenCount'] })
    },
  })
}

export function useMarkAllSeen() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => notificationsApi.markAllSeen().then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unseenCount'] })
    },
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      notificationsApi.deleteNotification(id).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unseenCount'] })
    },
  })
}
