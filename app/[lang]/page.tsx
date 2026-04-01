'use client'

import { useSearchParams } from 'next/navigation'
import { use, Suspense, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FooterBottom } from '@/components/layout/FooterBottom'
import { PosterCarousel } from '@/components/home/PosterCarousel'
import { ProductCarousel } from '@/components/home/ProductCarousel'
import { CategoryCarousel } from '@/components/home/CategoryCarousel'
import { ProductCard } from '@/components/ui/ProductCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { usePosters, useProducts, useCategoriesWithProducts } from '@/lib/hooks/useProducts'
import { getDictionary, type Locale } from '@/lib/i18n'
import { img } from '@/lib/utils/img'
import { formatCurrency } from '@/lib/utils/format'
import type { Dictionary } from '@/lib/i18n'

interface HomePageProps {
  params: Promise<{ lang: string }>
}

function HomeContent({ lang, dict }: { lang: string; dict: Dictionary }) {
  const searchParams = useSearchParams()
  const search = searchParams.get('search') ?? undefined

  const { data: postersData, isLoading: postersLoading } = usePosters()
  const { data: categoriesData, isLoading: catsLoading } = useCategoriesWithProducts({ size: 20 })
  const { data: bestSellingData, isLoading: bestSellingLoading } = useProducts({
    page: 0,
    size: 20,
    sort: 'SOLD_DESC',
  })
  const {
    data: productsData,
    isLoading: productsLoading,
    refetch: refetchProducts,
    isError: productsError,
  } = useProducts({ size: 20, search })

  const posters = postersData?.content ?? []
  const categories = categoriesData?.content ?? []
  const latestProducts = productsData?.content ?? []
  const bestSellingProducts = [...(bestSellingData?.content ?? [])]
    .sort((a, b) => b.soldQuantity - a.soldQuantity)
    .slice(0, 10)

  return (
    <main className="flex-1">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 xl:items-stretch xl:h-[500px] 2xl:h-[540px]">
          <div className="flex-1 min-w-0 xl:h-full">
            {postersLoading ? (
              <div className="w-full aspect-[16/9] xl:aspect-auto xl:h-full rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <PosterCarousel posters={posters} />
            )}
          </div>

          <div className="hidden xl:flex flex-col gap-3 w-72 flex-shrink-0 self-stretch min-h-0">
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
              {dict.home.bestSellingProducts}
            </h2>
            <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto pr-1">
              {bestSellingLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                bestSellingProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/${lang}/product/${product.id}`}
                    className="flex gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="relative w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                      {product.images?.[0]?.imageLink ? (
                        <Image
                          src={img(product.images[0].imageLink) ?? ''}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-xs font-bold text-blue-600 mt-1">
                        {formatCurrency(product.discountedPrice || product.sellPrice, lang)}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {dict.home.categories}
          </h2>
        </div>
        {catsLoading ? (
          <LoadingSpinner className="py-8" />
        ) : (
          <CategoryCarousel categories={categories} lang={lang} />
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {search ? `"${search}" — ${dict.common.searchResults}` : dict.home.latestProducts}
          </h2>
          {!search && (
            <Link
              href={`/${lang}/category/all`}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {dict.home.viewAll}
            </Link>
          )}
        </div>

        {productsLoading ? (
          <LoadingSpinner className="py-16" />
        ) : productsError ? (
          <ErrorState
            message={dict.common.error}
            retryLabel={dict.common.retry}
            onRetry={refetchProducts}
          />
        ) : latestProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            {dict.category.noProducts}
          </div>
        ) : (
          <>
            <div className="mb-8">
              <ProductCarousel products={latestProducts.slice(0, 10)} lang={lang} dict={dict} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {latestProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  lang={lang}
                  dictionary={dict}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  )
}

export default function HomePage({ params }: HomePageProps) {
  const { lang } = use(params)
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    getDictionary(lang as Locale).then(setDict)
  }, [lang])

  if (!dict) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <>
      <Navbar lang={lang} dictionary={dict} />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center py-24">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <HomeContent lang={lang} dict={dict} />
      </Suspense>
      <Footer lang={lang} dictionary={dict} />
      <FooterBottom dictionary={dict} />
    </>
  )
}
