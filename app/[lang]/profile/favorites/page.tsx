'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { useFavoritesQuery } from '@/lib/hooks/useFavorites'
import { ProductCard } from '@/components/ui/ProductCard'
import { getDictionary, type Locale, type Dictionary } from '@/lib/i18n'

interface PageProps {
  params: Promise<{ lang: string }>
}

function FavoriteSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl aspect-square" />
      ))}
    </div>
  )
}

export default function ProfileFavoritesPage({ params }: PageProps) {
  const { lang } = use(params)
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    getDictionary(lang as Locale).then(setDict)
  }, [lang])

  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const { data: favoritesData, isLoading } = useFavoritesQuery()

  useEffect(() => {
    if (!isLoggedIn) router.replace(`/${lang}/login`)
  }, [isLoggedIn, lang, router])

  if (!dict) return null

  const products = favoritesData?.content ?? []

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {dict.profile.favorites}
      </h1>

      {isLoading ? (
        <FavoriteSkeleton />
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center py-20 text-center px-4">
          <svg
            className="w-20 h-20 text-gray-200 dark:text-gray-700 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {dict.favorites.empty}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
            {dict.favorites.emptyDesc}
          </p>
          <Link
            href={`/${lang}`}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            {dict.cart.continueShopping}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
              dictionary={dict}
            />
          ))}
        </div>
      )}
    </div>
  )
}
