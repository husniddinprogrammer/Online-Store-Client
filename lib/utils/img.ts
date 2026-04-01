/**
 * Resolves an image URL from the API.
 * - Absolute URLs (http/https) → returned as-is
 * - Relative paths (/uploads/...) → keep same-origin so Next can rewrite/cache them
 * - null/undefined → null
 */
export function img(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('http') || url.startsWith('//') || url.startsWith('data:')) return url
  return url.startsWith('/') ? url : `/${url}`
}
