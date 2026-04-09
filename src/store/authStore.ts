import { create } from 'zustand'
import type { AuthResponse } from '@/services/api/types'

interface StoredUser {
  id: number
  name: string
  email: string
  role: string
}

interface AuthStore {
  user: StoredUser | null
  accessToken: string | null
  isLoggedIn: boolean
  setAuth: (auth: AuthResponse) => void
  logout: () => void
  initialize: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isLoggedIn: false,

  setAuth: (auth: AuthResponse) => {
    const user: StoredUser = {
      id: auth.userId,
      name: auth.name,
      email: auth.email,
      role: auth.role,
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', auth.accessToken)
      localStorage.setItem('refreshToken', auth.refreshToken)
      localStorage.setItem('user', JSON.stringify(user))
    }
    set({ user, accessToken: auth.accessToken, isLoggedIn: true })
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
    set({ user: null, accessToken: null, isLoggedIn: false })
  },

  initialize: () => {
    if (typeof window === 'undefined') return
    const accessToken = localStorage.getItem('accessToken')
    const userStr = localStorage.getItem('user')
    if (accessToken && userStr) {
      try {
        const user: StoredUser = JSON.parse(userStr)
        set({ user, accessToken, isLoggedIn: true })
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    }
  },
}))
