'use client'

import { useEffect, useState } from 'react'
import Image from '@/components/ui/AppImage'
import Link from '@/router/navigation'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { products as productsApi } from '@/services/api/endpoints'
import { img } from '@/utils/img'
import type { ProductResponse } from '@/services/api/types'

interface SearchDropdownProps {
  query: string
  lang: string
  onSelect: () => void
  onClose: () => void
}

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

function getMainImage(product: ProductResponse): string | null {
  return (
    product.images?.find((i) => i.isMain)?.imageLink ??
    product.images?.[0]?.imageLink ??
    null
  )
}

export function SearchDropdown({ query, lang, onSelect, onClose }: SearchDropdownProps) {
  const debouncedQuery = useDebounce(query, 300)

  const { data, isFetching } = useQuery({
    queryKey: ['searchProducts', debouncedQuery],
    queryFn: () =>
      productsApi
        .getProducts({ search: debouncedQuery, size: 8 })
        .then((r) => r.data.data),
    enabled: debouncedQuery.trim().length >= 1,
    staleTime: 30_000,
  })

  // Close on Escape only — outside click is handled by the parent wrapper
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const results = data?.content ?? []
  const show = debouncedQuery.trim().length >= 1

  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.5 }}
        className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-200/70 dark:border-slate-700/60 shadow-2xl shadow-slate-900/12 z-50 overflow-hidden"
      >
        {isFetching && results.length === 0 ? (
          /* Loading skeleton */
          <div className="p-2 flex flex-col gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl animate-pulse"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="h-3.5 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="h-3 w-1/3 bg-slate-100 dark:bg-slate-700 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
            <svg
              className="w-10 h-10 text-slate-300 dark:text-slate-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8" strokeWidth={1.5} />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth={1.5} />
            </svg>
            <p className="text-sm font-medium">Natija topilmadi</p>
            <p className="text-xs text-slate-400 dark:text-slate-600">
              «{debouncedQuery}» bo&apos;yicha hech narsa yo&apos;q
            </p>
          </div>
        ) : (
          <div className="p-2">
            {results.map((product, i) => {
              const mainImage = img(getMainImage(product))
              const hasDiscount = product.discountPercent > 0
              const price = hasDiscount ? product.discountedPrice : product.sellPrice

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={`/${lang}/product/${product.id}`}
                    onClick={onSelect}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors group"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-200 dark:group-hover:ring-blue-800 transition-all">
                      {mainImage ? (
                        <Image
                          src={mainImage}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1 transition-colors">
                        <HighlightMatch text={product.name} query={debouncedQuery} />
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {product.category?.name}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex-shrink-0 text-right">
                      <p
                        className={`text-sm font-bold ${hasDiscount ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-100'}`}
                      >
                        {price.toLocaleString()} сум
                      </p>
                      {hasDiscount && (
                        <p className="text-xs text-slate-400 line-through">
                          {product.sellPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              )
            })}

            {/* See all results */}
            {data && data.totalElements > results.length && (
              <div className="mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href={`/${lang}?search=${encodeURIComponent(debouncedQuery)}`}
                  onClick={onSelect}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                >
                  Barcha {data.totalElements} ta natijani ko&apos;rish
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded px-0.5 not-italic"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}
