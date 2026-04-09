import axios from 'axios'

interface ApiErrorPayload {
  detail?: string
  message?: string
  title?: string
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorPayload | undefined

    return data?.detail || data?.message || data?.title || fallback
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
