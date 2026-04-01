// ─── Generic wrappers ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedData<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** Flat response from POST /api/auth/login and /register */
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  userId: number
  email: string
  name: string
  role: 'CUSTOMER' | 'ADMIN' | 'DELIVERY' | 'SUPER_ADMIN'
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UserResponse {
  id: number
  name: string
  surname: string
  email: string
  birthdayAt: string | null
  phoneNumber: string | null
  balance: number
  blocked: boolean
  role: 'CUSTOMER' | 'ADMIN' | 'DELIVERY' | 'SUPER_ADMIN'
  lastLoginAt: string
  createdAt: string
  emailVerified: boolean
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface CategoryResponse {
  id: number
  name: string
  imageLink: string | null
  productCount?: number
}

// ─── Company ──────────────────────────────────────────────────────────────────

export interface CompanyResponse {
  id: number
  name: string
  imageLink: string | null
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface ProductImageResponse {
  id: number
  imageLink: string
  isMain: boolean
}

export interface ProductResponse {
  id: number
  name: string
  description: string | null
  discountPercent: number
  stockQuantity: number
  soldQuantity: number
  category: CategoryResponse | null
  company: CompanyResponse | null
  arrivalPrice: number
  sellPrice: number
  discountedPrice: number
  createdAt: string
  updatedAt: string
  images: ProductImageResponse[]
  averageRating: number
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItemResponse {
  id: number
  productId: number
  productName: string
  productImageLink: string
  productPrice: number
  quantity: number
  totalPrice: number
}

export interface CartResponse {
  id: number
  items: CartItemResponse[]
  totalAmount: number
  totalItems: number
}

// ─── Address ──────────────────────────────────────────────────────────────────

export interface AddressResponse {
  id: number
  regionType: string
  cityType: string
  homeNumber: string
  roomNumber: string
  createdAt: string
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface OrderItemResponse {
  id: number
  productId: number
  productName: string
  productImageLink: string
  quantity: number
  price: number
  totalPrice: number
}

export interface OrderResponse {
  id: number
  userId: number
  userName: string
  totalAmount: number
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  createdAt: string
  deliveryAddress: AddressResponse | null
  items: OrderItemResponse[]
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export interface PaymentResponse {
  id: number
  orderId: number
  amount: number
  method: 'CARD' | 'CASH'
  status: 'PAID' | 'FAILED'
  createdAt: string
}

// ─── Comment ──────────────────────────────────────────────────────────────────

export interface CommentResponse {
  id: number
  productId: number
  userId: number
  userName: string
  userSurname: string
  text: string
  rating: number
  createdAt: string
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface ReviewEligibility {
  productId: number
  delivered: boolean
  commented: boolean
}

export interface ReviewedItem {
  id: number
  productId: number
  productName: string
  productImageLink: string | null
  rating: number
  text: string
  createdAt: string
}

export interface MyReviewsResponse {
  reviewed: ReviewedItem[]
  notReviewed: ProductResponse[]
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface NotificationResponse {
  id: number
  type: 'INFO' | 'WARNING' | 'ERROR'
  text: string
  isSeen: boolean
}

// ─── Poster ───────────────────────────────────────────────────────────────────

export interface PosterResponse {
  id: number
  imageLink: string
  clickQuantity: number
  link: string | null
  createdAt: string
}
