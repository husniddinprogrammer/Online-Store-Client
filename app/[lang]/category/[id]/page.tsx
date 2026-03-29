'use client'

import { use, useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FooterBottom } from '@/components/layout/FooterBottom'
import { ProductCard } from '@/components/ui/ProductCard'
import { Pagination } from '@/components/ui/Pagination'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { useProducts, useCompanies } from '@/lib/hooks/useProducts'
import { getDictionary, type Locale, type Dictionary } from '@/lib/i18n'

interface CategoryPageProps {
  params: Promise<{ lang: string; id: string }>
}

// Inner component using useSearchParams — wrapped in Suspense by parent
function CategoryContent({ lang, id, dict }: { lang: string; id: string; dict: Dictionary }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = parseInt(searchParams.get('page') ?? '0', 10)
  const minPrice = searchParams.get('minPrice') ?? ''
  const maxPrice = searchParams.get('maxPrice') ?? ''
  const companyId = searchParams.get('companyId')
  const sort = searchParams.get('sort') ?? 'newest'

  const [localMin, setLocalMin] = useState(minPrice)
  const [localMax, setLocalMax] = useState(maxPrice)
  const [localCompanies, setLocalCompanies] = useState<number[]>(
    companyId ? companyId.split(',').map(Number) : []
  )

  const categoryId = id !== 'all' ? parseInt(id, 10) : undefined

  const { data: productsData, isLoading, isError, refetch } = useProducts({
    page,
    size: 20,
    categoryId,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    companyId: companyId ? Number(companyId) : undefined,
    sort,
  })

  const { data: companiesData } = useCompanies({ size: 50 })

  const updateUrl = (updates: Record<string, string | null>) => {
    const current = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        current.delete(key)
      } else {
        current.set(key, value)
      }
    })
    current.set('page', '0')
    router.push(`/${lang}/category/${id}?${current.toString()}`)
  }

  const handleApplyFilters = () => {
    updateUrl({
      minPrice: localMin || null,
      maxPrice: localMax || null,
      companyId: localCompanies.length ? localCompanies.join(',') : null,
    })
  }

  const handleSort = (value: string) => {
    updateUrl({ sort: value })
  }

  const handlePageChange = (newPage: number) => {
    const current = new URLSearchParams(searchParams.toString())
    current.set('page', String(newPage))
    router.push(`/${lang}/category/${id}?${current.toString()}`)
  }

  const toggleCompany = (cid: number) => {
    setLocalCompanies((prev) =>
      prev.includes(cid) ? prev.filter((c) => c !== cid) : [...prev, cid]
    )
  }

  const products = productsData?.content ?? []
  const totalPages = productsData?.totalPages ?? 0
  const companies = companiesData?.content ?? []

  const sortOptions = [
    { value: 'newest', label: dict.category.newest },
    { value: 'popular', label: dict.category.popular },
    { value: 'byRating', label: dict.category.byRating },
    { value: 'cheapest', label: dict.category.cheapest },
    { value: 'expensive', label: dict.category.expensive },
    { value: 'biggestDiscount', label: dict.category.biggestDiscount },
    { value: 'smallestDiscount', label: dict.category.smallestDiscount },
  ]

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden md:flex flex-col gap-6 w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {dict.category.filters}
            </h3>

            {/* Price range */}
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {dict.category.priceRange}
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={dict.category.minPrice}
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder={dict.category.maxPrice}
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Companies */}
            {companies.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {dict.category.companies}
                </p>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                  {companies.map((company) => (
                    <label
                      key={company.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={localCompanies.includes(company.id)}
                        onChange={() => toggleCompany(company.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {company.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Apply button */}
            <button
              onClick={handleApplyFilters}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {dict.category.apply}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort + result count */}
          <div className="flex items-center justify-between mb-4 gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {productsData?.totalElements
                ? `${productsData.totalElements} ta mahsulot`
                : ''}
            </p>
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort-select"
                className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block"
              >
                {dict.category.sortBy}:
              </label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => handleSort(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products grid */}
          {isLoading ? (
            <LoadingSpinner className="py-24" size="lg" />
          ) : isError ? (
            <ErrorState
              message={dict.common.error}
              retryLabel={dict.common.retry}
              onRetry={refetch}
            />
          ) : products.length === 0 ? (
            <div className="text-center py-24 text-gray-500 dark:text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p>{dict.category.noProducts}</p>
            </div>
          ) : (
            <>
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
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { lang, id } = use(params)
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
        <CategoryContent lang={lang} id={id} dict={dict} />
      </Suspense>
      <Footer lang={lang} dictionary={dict} />
      <FooterBottom dictionary={dict} />
    </>
  )
}
