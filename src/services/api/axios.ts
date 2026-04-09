import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { defaultLocale } from '@/i18n'
import { unwrapApiData } from './types'
import type { AuthResponse, MaybeApiResponse } from './types'

export const BASE_URL = 'https://api.online-store-beta.uz'
export const BASE_IMAGE_URL = 'https://api.online-store-beta.uz'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = window.localStorage.getItem('accessToken')

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token as string)
    }
  })

  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status === 401 && !originalRequest?._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }

            return axiosInstance(originalRequest)
          })
          .catch((refreshError) => Promise.reject(refreshError))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = window.localStorage.getItem('refreshToken')

      if (!refreshToken) {
        isRefreshing = false
        clearAuthAndRedirect()
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post<MaybeApiResponse<AuthResponse>>(
          `${BASE_URL}/api/auth/refresh-token`,
          {
            refreshToken,
          }
        )

        const authData = unwrapApiData(data)
        const newAccessToken = authData.accessToken
        const newRefreshToken = authData.refreshToken

        window.localStorage.setItem('accessToken', newAccessToken)
        if (newRefreshToken) {
          window.localStorage.setItem('refreshToken', newRefreshToken)
        }

        processQueue(null, newAccessToken)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }

        return axiosInstance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearAuthAndRedirect()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

function clearAuthAndRedirect() {
  window.localStorage.removeItem('accessToken')
  window.localStorage.removeItem('refreshToken')
  window.localStorage.removeItem('user')

  const pathParts = window.location.pathname.split('/')
  const locale = pathParts[1] || defaultLocale
  window.location.href = `/${locale}/login`
}

export default axiosInstance
