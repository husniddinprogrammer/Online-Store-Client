'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { img } from '@/lib/utils/img'
import { ProductResponse } from '@/lib/api/types'
import { formatCurrency } from '@/lib/utils/format'

interface ProductCardProps {
  product: ProductResponse
  lang?: string
}

export function ProductCard({ product, lang }: ProductCardProps) {
  const mainImage = product.images.find((i) => i.isMain) || product.images[0]
  const hasDiscount = product.discountPercent > 0
  const displayPrice = hasDiscount ? product.discountedPrice : product.sellPrice
  const inStock = product.stockQuantity > 0

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Link href={`/product/${product.id}`} className="group block h-full">
        <div className="h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 overflow-hidden hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-xl hover:shadow-slate-900/8 dark:hover:shadow-slate-900/50 transition-all duration-300 flex flex-col">

          <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
            {mainImage ? (
              <>
                <Image
                  src={img(mainImage.imageLink) ?? ''}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
              {hasDiscount && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg shadow-sm">
                  -{product.discountPercent}%
                </span>
              )}
              {!inStock && (
                <span className="bg-slate-900/80 text-white text-xs font-medium px-2 py-0.5 rounded-lg backdrop-blur-sm">
                  Tugagan
                </span>
              )}
            </div>

            {product.averageRating > 0 && (
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-lg">
                <svg className="w-3 h-3 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {product.averageRating.toFixed(1)}
              </div>
            )}
          </div>

          <div className="p-4 flex flex-col flex-1 gap-2">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {product.name}
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {product.category && (
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {product.category.name}
                </span>
              )}
              {product.company && (
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {product.company.name}
                </span>
              )}
            </div>

            <div className="mt-auto pt-2 flex items-end justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {formatCurrency(displayPrice ?? 0, lang)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatCurrency(product.sellPrice ?? 0, lang)}
                  </span>
                )}
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${
                inStock
                  ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40'
                  : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/40'
              }`}>
                {inStock ? `${product.stockQuantity} ta` : 'Tugagan'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
