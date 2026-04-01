'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { img } from '@/lib/utils/img'
import { formatCurrency } from '@/lib/utils/format'
import { StarRating } from './StarRating'
import { useToggleFavorite } from '@/lib/hooks/useFavorites'
import { useLocalCartStore } from '@/lib/store/cartStore'
import { useAuthStore } from '@/lib/store/authStore'
import { useAddToCart, useCartQuery } from '@/lib/hooks/useCart'
import type { ProductResponse } from '@/lib/api/types'
import type { Dictionary } from '@/lib/i18n'

interface ProductCardProps {
  product: ProductResponse
  lang: string
  dictionary: Dictionary
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function CartIconSm() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function getMainImage(product: ProductResponse): string | null {
  const main = product.images?.find((i) => i.isMain)
  return main?.imageLink ?? product.images?.[0]?.imageLink ?? null
}

export function ProductCard({ product, lang, dictionary }: ProductCardProps) {
  const { isFavorite, toggle: toggleFavorite } = useToggleFavorite(product.id)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const localAddItem = useLocalCartStore((s) => s.addItem)
  const addToCartMutation = useAddToCart()
  const localCart = useLocalCartStore((s) => s.items)
  const { data: serverCart } = useCartQuery()

  const inLocalCart = isLoggedIn
    ? serverCart?.items.some((i) => i.productId === product.id) ?? false
    : localCart.some((i) => i.productId === product.id)
  const rawImage = getMainImage(product)
  const mainImage = img(rawImage)
  const inStock = product.stockQuantity > 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isLoggedIn) {
      addToCartMutation.mutate({ productId: product.id, quantity: 1 })
    } else {
      localAddItem({
        productId: product.id,
        quantity: 1,
        name: product.name,
        price: product.sellPrice,
        image: mainImage || '',
        discountPercent: product.discountPercent,
        discountedPrice: product.discountedPrice,
      })
    }
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite()
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="flex flex-col h-full"
    >
      <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 overflow-hidden hover:border-blue-200 dark:hover:border-blue-900/60 hover:shadow-xl hover:shadow-slate-900/8 dark:hover:shadow-slate-900/60 transition-all duration-300 flex flex-col flex-1">

        <div className="relative" style={{ aspectRatio: '1/1' }}>
          <Link href={`/${lang}/product/${product.id}`} className="absolute inset-0">
            {mainImage ? (
              <>
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            ) : (
              <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </Link>

          {product.discountPercent > 0 && (
            <div className="absolute top-2.5 left-2.5 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg shadow-sm pointer-events-none">
              -{product.discountPercent}%
            </div>
          )}

          <motion.button
            onClick={handleFavorite}
            whileTap={{ scale: 0.85 }}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm backdrop-blur-sm transition-all duration-150 ${
              isFavorite
                ? 'bg-red-500 text-white shadow-red-500/30'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-red-500'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <HeartIcon filled={isFavorite} />
          </motion.button>
        </div>

        <div className="p-3.5 flex flex-col gap-2.5 flex-1">
          <Link href={`/${lang}/product/${product.id}`}>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          <StarRating rating={product.averageRating} size="sm" />

          <div className="flex flex-wrap gap-1.5">
            {product.category && (
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                {product.category.name}
              </span>
            )}
            {product.company && (
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                {product.company.name}
              </span>
            )}
          </div>

          <div className="flex items-end gap-2">
            {product.discountPercent > 0 && product.discountedPrice ? (
              <>
                <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(product.discountedPrice, lang)}
                </span>
                <span className="text-xs text-slate-400 line-through mb-0.5">
                  {formatCurrency(product.sellPrice ?? 0, lang)}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(product.sellPrice ?? 0, lang)}
              </span>
            )}
          </div>

          <motion.button
            onClick={handleAddToCart}
            disabled={!inStock}
            whileTap={inStock ? { scale: 0.97 } : {}}
            className={`mt-auto flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-150 ${
              !inStock
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : inLocalCart
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-sm shadow-blue-600/25'
            }`}
          >
            {inLocalCart ? <CheckIcon /> : <CartIconSm />}
            {!inStock
              ? dictionary?.product?.outOfStock || 'Tugagan'
              : inLocalCart
                ? dictionary?.product?.inCart || 'Savatda'
                : dictionary?.product?.addToCart || 'Savatga'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
