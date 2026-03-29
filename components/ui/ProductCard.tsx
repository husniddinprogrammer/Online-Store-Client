'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { StarRating } from './StarRating'
import { useToggleFavorite } from '@/lib/hooks/useFavorites'
import { useLocalCartStore } from '@/lib/store/cartStore'
import { useAuthStore } from '@/lib/store/authStore'
import { useAddToCart } from '@/lib/hooks/useCart'
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
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? '#ef4444' : 'none'}
      stroke={filled ? '#ef4444' : 'currentColor'}
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function CartIconSm() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

/** Returns the main image URL or null */
function getMainImage(product: ProductResponse): string | null {
  const main = product.images?.find((img) => img.isMain)
  return main?.imageLink ?? product.images?.[0]?.imageLink ?? null
}

export function ProductCard({ product, lang, dictionary }: ProductCardProps) {
  const { isFavorite, toggle: toggleFavorite } = useToggleFavorite(product.id)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const localAddItem = useLocalCartStore((s) => s.addItem)
  const addToCartMutation = useAddToCart()
  const localCart = useLocalCartStore((s) => s.items)

  const inLocalCart = localCart.some((i) => i.productId === product.id)
  const mainImage = getMainImage(product)
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
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col"
    >
      {/* Image area */}
      <div className="relative" style={{ aspectRatio: '4/3' }}>
        <Link href={`/${lang}/product/${product.id}`}>
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </Link>

        {product.discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full pointer-events-none">
            -{product.discountPercent}%
          </div>
        )}

        <button
          onClick={handleFavorite}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          aria-label={isFavorite ? dictionary.product.removeFromFavorites : dictionary.product.addToFavorites}
        >
          <HeartIcon filled={isFavorite} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <Link href={`/${lang}/product/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        <StarRating rating={product.averageRating} size="sm" />

        <div className="flex items-end gap-1.5">
          {product.discountPercent > 0 ? (
            <>
              <span className="text-base font-bold text-blue-600">
                {product.discountedPrice.toLocaleString()} сум
              </span>
              <span className="text-xs text-gray-400 line-through">
                {product.sellPrice.toLocaleString()} сум
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-gray-800 dark:text-gray-100">
              {product.sellPrice.toLocaleString()} сум
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`mt-auto flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
            !inStock
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              : inLocalCart
              ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-500'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <CartIconSm />
          {!inStock
            ? dictionary.product.outOfStock
            : inLocalCart
            ? dictionary.product.inCart
            : dictionary.product.addToCart}
        </button>
      </div>
    </motion.div>
  )
}
