import axiosInstance from './axios'
import type {
  ApiResponse,
  PaginatedData,
  AuthResponse,
  CategoryResponse,
  CompanyResponse,
  ProductResponse,
  CartResponse,
  CartItemResponse,
  CommentResponse,
  PosterResponse,
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

export const auth = {
  login: (payload: LoginPayload) =>
    axiosInstance.post<ApiResponse<AuthResponse>>('/api/auth/login', payload),

  register: (payload: RegisterPayload) =>
    axiosInstance.post<ApiResponse<AuthResponse>>('/api/auth/register', payload),

  logout: () => axiosInstance.post<ApiResponse<null>>('/api/auth/logout'),

  refreshToken: (refreshToken: string) =>
    axiosInstance.post<ApiResponse<AuthResponse>>('/api/auth/refresh-token', {
      refreshToken,
    }),
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
    axiosInstance.get<ApiResponse<PaginatedData<ProductResponse>>>(
      '/api/products',
      { params }
    ),

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
    axiosInstance.get<ApiResponse<PaginatedData<CategoryResponse>>>(
      '/api/categories',
      { params }
    ),
}

// ──────────────────────────────────────────────
// Posters
// ──────────────────────────────────────────────

export const posters = {
  getPosters: (params?: { page?: number; size?: number }) =>
    axiosInstance.get<ApiResponse<PaginatedData<PosterResponse>>>('/api/posters', { params }),

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
  getCart: () =>
    axiosInstance.get<ApiResponse<CartResponse>>('/api/carts'),

  addToCart: (payload: AddToCartPayload) =>
    axiosInstance.post<ApiResponse<CartItemResponse>>('/api/carts/items', payload),

  updateCartItem: (itemId: number, payload: UpdateCartItemPayload) =>
    axiosInstance.patch<ApiResponse<CartResponse>>(
      `/api/carts/items/${itemId}`,
      null,
      { params: { quantity: payload.quantity } }
    ),

  removeCartItem: (itemId: number) =>
    axiosInstance.delete<ApiResponse<null>>(`/api/carts/items/${itemId}`),

  clearCart: () =>
    axiosInstance.delete<ApiResponse<null>>('/api/carts'),
}

// ──────────────────────────────────────────────
// Favorites
// ──────────────────────────────────────────────

export const favorites = {
  getFavorites: (params?: { page?: number; size?: number }) =>
    axiosInstance.get<ApiResponse<PaginatedData<ProductResponse>>>('/api/favorite-products', { params }),

  addFavorite: (productId: number) =>
    axiosInstance.post<ApiResponse<null>>(`/api/favorite-products/${productId}`),

  removeFavorite: (productId: number) =>
    axiosInstance.delete<ApiResponse<null>>(
      `/api/favorite-products/${productId}`
    ),
}

// ──────────────────────────────────────────────
// Comments
// ──────────────────────────────────────────────

export interface CommentsParams {
  page?: number
  size?: number
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
    axiosInstance.get<ApiResponse<PaginatedData<CompanyResponse>>>(
      '/api/companies',
      { params }
    ),
}
