import { BASE_IMAGE_URL } from '@/services/api/axios'

/**
 * Resolves an image URL from the API.
 * - Absolute URLs (http/https) -> returned as-is
 * - Relative paths (/uploads/...) -> resolved against the API host
 * - null/undefined -> null
 */
export function img(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('http') || url.startsWith('//') || url.startsWith('data:'))
    return url
  return url.startsWith('/') ? `${BASE_IMAGE_URL}${url}` : `${BASE_IMAGE_URL}/${url}`
}
