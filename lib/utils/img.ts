const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

/**
 * Resolves an image URL from the API.
 * - Absolute URLs (http/https) → returned as-is
 * - Relative paths (/uploads/...) → prepend BACKEND base
 * - null/undefined → null
 */
export function img(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('http') || url.startsWith('//') || url.startsWith('data:')) return url
  return `${BACKEND}${url.startsWith('/') ? '' : '/'}${url}`
}
