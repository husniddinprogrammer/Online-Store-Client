'use client'

import { use, useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FooterBottom } from '@/components/layout/FooterBottom'
import { ProductGrid } from '@/components/products/ProductGrid'
import { Pagination } from '@/components/ui/Pagination'
import { SortSelect } from '@/components/ui/SortSelect'
import { useProducts } from '@/lib/hooks/useProducts'
import { getDictionary, type Locale, type Dictionary } from '@/lib/i18n'

interface CompanyPageProps {
  params: Promise<{ lang: string; id: string }>
}

// Inner component using useSearchParams — wrapped in Suspense by parent
function CompanyContent({ lang, id, dict }: { lang: string; id: string; dict: Dictionary }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = parseInt(searchParams.get('page') ?? '0', 10)
  const sort = searchParams.get('sort') ?? 'NEWEST'

  const companyId = parseInt(id, 10)

  const { data: productsData, isLoading, error } = useProducts({
    page,
    size: 20,
    companyId,
    sort,
  })

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
    router.push(`/${lang}/company/${id}?${current.toString()}`)
  }

  const handleSort = (value: string) => {
    updateUrl({ sort: value })
  }

  const handlePageChange = (newPage: number) => {
    const current = new URLSearchParams(searchParams.toString())
    current.set('page', String(newPage))
    router.push(`/${lang}/company/${id}?${current.toString()}`)
  }

  const products = productsData?.content ?? []
  const totalPages = productsData?.totalPages ?? 0
  const productsCountLabel = productsData?.totalElements != null
    ? dict.category.productsCount.replace('{count}', String(productsData.totalElements))
    : dict.common.loading

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {dict.home.categories} {id}
        </h1>
        <p className="text-gray-600">
          {productsCountLabel}
        </p>
      </div>

      {/* Sort controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
            {dict.category.sortBy}:
          </label>
          <SortSelect value={sort} onChange={handleSort} dictionary={dict.category} />
        </div>
      </div>

      {/* Products grid */}
      <ProductGrid 
        products={products} 
        loading={isLoading} 
        error={!!error} 
        lang={lang}
        dictionary={dict}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </main>
  )
}

export default function CompanyPage({ params }: CompanyPageProps) {
  const { lang, id } = use(params)
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    getDictionary(lang as Locale).then(setDict)
  }, [lang])

  if (!dict) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <Navbar lang={lang} dictionary={dict} />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <CompanyContent lang={lang} id={id} dict={dict} />
      </Suspense>
      <Footer lang={lang} dictionary={dict} />
      <FooterBottom dictionary={dict} />
    </>
  )
}
