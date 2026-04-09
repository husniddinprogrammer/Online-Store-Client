import axiosInstance from './axios'
import { unwrapApiData } from './types'
import type {
  ApiResponse,
  MaybeApiResponse,
  PaginatedData,
  AuthResponse,
  CategoryResponse,
  CompanyResponse,
  ProductResponse,
  CartResponse,
  CartItemResponse,
  CommentResponse,
  PosterResponse,
  UserResponse,
  AddressResponse,
  OrderResponse,
  NotificationResponse,
  ReviewEligibility,
} from './types'

// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  surname: string
  email: string
  password: string
  phoneNumber?: string
  birthdayAt?: string
}

export interface ForgotPasswordPayload {
  email: string
}

export const auth = {
  login: (payload: LoginPayload) =>
    axiosInstance
      .post<MaybeApiResponse<AuthResponse>>('/api/auth/login', payload)
      .then(({ data }) => unwrapApiData(data)),

  register: (payload: RegisterPayload) =>
    axiosInstance
      .post<MaybeApiResponse<AuthResponse>>('/api/auth/register', payload)
      .then(({ data }) => unwrapApiData(data)),

  logout: () => axiosInstance.post<ApiResponse<null>>('/api/auth/logout'),

  refreshToken: (refreshToken: string) =>
    axiosInstance
      .post<MaybeApiResponse<AuthResponse>>('/api/auth/refresh-token', {
        refreshToken,
      })
      .then(({ data }) => unwrapApiData(data)),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    axiosInstance.post<ApiResponse<null>>('/api/auth/forgot-password', payload),
}

// ──────────────────────────────────────────────
// Products
// ──────────────────────────────────────────────

export interface ProductsParams {
  page?: number
  size?: number
  search?: string
  categoryId?: number
  minPrice?: number
  maxPrice?: number
  companyId?: number
  sort?: string
}

export const products = {
  getProducts: (params?: ProductsParams) =>
    axiosInstance.get<ApiResponse<PaginatedData<ProductResponse>>>('/api/products', {
      params,
    }),

  getProduct: (id: number) =>
    axiosInstance.get<ApiResponse<ProductResponse>>(`/api/products/${id}`),
}

// ──────────────────────────────────────────────
// Categories
// ──────────────────────────────────────────────

export interface CategoriesParams {
  page?: number
  size?: number
  parentId?: number | null
}

export const categories = {
  getCategories: (params?: CategoriesParams) =>
    axiosInstance.get<ApiResponse<PaginatedData<CategoryResponse>>>('/api/categories', {
      params,
    }),
  getCategory: (id: number) =>
    axiosInstance.get<ApiResponse<CategoryResponse>>(`/api/categories/${id}`),
}

// ──────────────────────────────────────────────
// Posters
// ──────────────────────────────────────────────

export const posters = {
  getPosters: (params?: { page?: number; size?: number }) =>
    axiosInstance.get<ApiResponse<PaginatedData<PosterResponse>>>('/api/posters', {
      params,
    }),

  clickPoster: (id: number) =>
    axiosInstance.post<ApiResponse<null>>(`/api/posters/${id}/click`),
}

// ──────────────────────────────────────────────
// Cart
// ──────────────────────────────────────────────

export interface AddToCartPayload {
  productId: number
  quantity: number
}

export interface UpdateCartItemPayload {
  quantity: number
}

export const cart = {
  getCart: () => axiosInstance.get<ApiResponse<CartResponse>>('/api/carts'),

  addToCart: (payload: AddToCartPayload) =>
    axiosInstance.post<ApiResponse<CartItemResponse>>('/api/carts/items', payload),

  updateCartItem: (itemId: number, payload: UpdateCartItemPayload) =>
    axiosInstance.patch<ApiResponse<CartResponse>>(`/api/carts/items/${itemId}`, null, {
      params: { quantity: payload.quantity },
    }),

  removeCartItem: (itemId: number) =>
    axiosInstance.delete<ApiResponse<null>>(`/api/carts/items/${itemId}`),

  clearCart: () => axiosInstance.delete<ApiResponse<null>>('/carts'),
}

// ──────────────────────────────────────────────
// Favorites
// ──────────────────────────────────────────────

export const favorites = {
  getFavorites: (params?: { page?: number; size?: number }) =>
    axiosInstance.get<ApiResponse<PaginatedData<ProductResponse>>>(
      '/api/favorite-products',
      {
        params,
      }
    ),

  addFavorite: (productId: number) =>
    axiosInstance.post<ApiResponse<null>>(`/api/favorite-products/${productId}`),

  removeFavorite: (productId: number) =>
    axiosInstance.delete<ApiResponse<null>>(`/api/favorite-products/${productId}`),
}

// ──────────────────────────────────────────────
// Comments
// ──────────────────────────────────────────────

export interface CommentsParams {
  page?: number
  size?: number
  sort?: string
}

export interface AddCommentPayload {
  productId: number
  rating: number
  text: string
}

export const comments = {
  getComments: (productId: number, params?: CommentsParams) =>
    axiosInstance.get<ApiResponse<PaginatedData<CommentResponse>>>(
      `/api/comments/product/${productId}`,
      { params }
    ),

  addComment: (payload: AddCommentPayload) =>
    axiosInstance.post<ApiResponse<CommentResponse>>('/api/comments', payload),

  updateComment: (id: number, payload: AddCommentPayload) =>
    axiosInstance.put<ApiResponse<CommentResponse>>(`/api/comments/${id}`, payload),

  deleteComment: (id: number) =>
    axiosInstance.delete<ApiResponse<null>>(`/api/comments/${id}`),
}

// ──────────────────────────────────────────────
// Companies
// ──────────────────────────────────────────────

export interface CompaniesParams {
  page?: number
  size?: number
  search?: string
}

export const companies = {
  getCompanies: (params?: CompaniesParams) =>
    axiosInstance.get<ApiResponse<PaginatedData<CompanyResponse>>>('/api/companies', {
      params,
    }),
}

// ──────────────────────────────────────────────
// User profile
// ──────────────────────────────────────────────

export const users = {
  getMe: () => axiosInstance.get<ApiResponse<UserResponse>>('/api/users/me'),
  updateMe: (payload: {
    name: string
    surname: string
    phoneNumber?: string
    birthdayAt?: string
  }) => axiosInstance.put<ApiResponse<UserResponse>>('/api/users/me', payload),
  changePassword: (payload: { oldPassword: string; newPassword: string }) =>
    axiosInstance.put<ApiResponse<null>>('/api/users/me/change-password', payload),
  topUp: (amount: number) =>
    axiosInstance.post<ApiResponse<UserResponse>>('/api/users/balance/top-up', { amount }),
}

// ──────────────────────────────────────────────
// Addresses
// ──────────────────────────────────────────────

export const addresses = {
  getAddresses: () => axiosInstance.get<ApiResponse<AddressResponse[]>>('/api/addresses'),
  createAddress: (payload: {
    regionType: string
    cityType: string
    homeNumber: string
    roomNumber: string
  }) => axiosInstance.post<ApiResponse<AddressResponse>>('/api/addresses', payload),
  updateAddress: (
    id: number,
    payload: {
      regionType: string
      cityType: string
      homeNumber: string
      roomNumber: string
    }
  ) => axiosInstance.put<ApiResponse<AddressResponse>>(`/api/addresses/${id}`, payload),
  deleteAddress: (id: number) =>
    axiosInstance.delete<ApiResponse<null>>(`/api/addresses/${id}`),
}

// ──────────────────────────────────────────────
// Orders
// ──────────────────────────────────────────────

export const orders = {
  getMyOrders: (params?: { status?: string; page?: number; size?: number }) =>
    axiosInstance.get<ApiResponse<PaginatedData<OrderResponse>>>('/api/orders/my', {
      params,
    }),
  getMyOrder: (id: number) =>
    axiosInstance.get<ApiResponse<OrderResponse>>(`/api/orders/my/${id}`),
  cancelOrder: (id: number) =>
    axiosInstance.patch<ApiResponse<OrderResponse>>(`/api/orders/my/${id}/cancel`),
  createOrder: (payload: { addressId: number }) =>
    axiosInstance.post<ApiResponse<OrderResponse>>('/api/orders', payload),
}

// ──────────────────────────────────────────────
// Reviews
// ──────────────────────────────────────────────

export const reviews = {
  getMyReviews: (params?: { page?: number; size?: number }) =>
    axiosInstance.get<ApiResponse<PaginatedData<CommentResponse>>>('/api/reviews/my', {
      params,
    }),

  getPendingReviews: (params?: { page?: number; size?: number }) =>
    axiosInstance.get<ApiResponse<PaginatedData<ProductResponse>>>(
      '/api/reviews/pending-review',
      { params }
    ),

  getEligibility: (productId: number) =>
    axiosInstance.get<ApiResponse<ReviewEligibility>>(
      `/api/reviews/eligibility/${productId}`
    ),
}

// ──────────────────────────────────────────────
// Notifications
// ──────────────────────────────────────────────

export const notifications = {
  getNotifications: (params?: { page?: number; size?: number }) =>
    axiosInstance.get<ApiResponse<PaginatedData<NotificationResponse>>>(
      '/api/notifications',
      { params }
    ),
  getUnseenCount: () =>
    axiosInstance.get<ApiResponse<number>>('/api/notifications/unseen-count'),
  markSeen: (id: number) =>
    axiosInstance.patch<ApiResponse<null>>(`/api/notifications/${id}/seen`),
  markAllSeen: () =>
    axiosInstance.patch<ApiResponse<null>>('/api/notifications/seen-all'),
  deleteNotification: (id: number) =>
    axiosInstance.delete<ApiResponse<null>>(`/api/notifications/${id}`),
}
