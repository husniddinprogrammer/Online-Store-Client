'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FooterBottom } from '@/components/layout/FooterBottom'
import { ProductCard } from '@/components/ui/ProductCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useFavoritesQuery } from '@/lib/hooks/useFavorites'
import { useLocalFavoritesStore } from '@/lib/store/favoritesStore'
import { useAuthStore } from '@/lib/store/authStore'
import { useProducts } from '@/lib/hooks/useProducts'
import { getDictionary, type Locale, type Dictionary } from '@/lib/i18n'

interface FavoritesPageProps {
  params: Promise<{ lang: string }>
}

export default function FavoritesPage({ params }: FavoritesPageProps) {
  const { lang } = use(params)
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    getDictionary(lang as Locale).then(setDict)
  }, [lang])

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const { data: serverFavorites, isLoading } = useFavoritesQuery()
  const localFavoriteIds = useLocalFavoritesStore((s) => s.productIds)

  // For guest users, fetch product details by IDs
  const { data: localProductsData, isLoading: localLoading } = useProducts({
    size: 100,
  })

  if (!dict) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if ((isLoggedIn && isLoading) || (!isLoggedIn && localLoading)) {
    return (
      <>
        <Navbar lang={lang} dictionary={dict} />
        <div className="flex-1 flex items-center justify-center py-24">
          <LoadingSpinner size="lg" />
        </div>
      </>
    )
  }

  const products = isLoggedIn
    ? serverFavorites?.content ?? []
    : (localProductsData?.content ?? []).filter((p) =>
        localFavoriteIds.includes(p.id)
      )

  return (
    <>
      <Navbar lang={lang} dictionary={dict} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {dict.favorites.title}
        </h1>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
      </main>

      <Footer lang={lang} dictionary={dict} />
      <FooterBottom dictionary={dict} />
    </>
  )
}
