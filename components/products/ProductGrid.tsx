import { ProductResponse } from '@/lib/api/types'
import { ProductCard } from '@/components/ui/ProductCard'
import type { Dictionary } from '@/lib/i18n'
import { defaultLocale } from '@/lib/i18n'
import { ProductSkeleton } from './ProductSkeleton'

interface ProductGridProps {
  products: ProductResponse[]
  loading?: boolean
  error?: boolean
  lang?: string
  dictionary: Dictionary
}

export function ProductGrid({ products, loading, error, lang, dictionary }: ProductGridProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-gray-500 text-center">
          <div className="text-lg font-medium mb-2">Failed to load products</div>
          <div className="text-sm">Please try again later</div>
        </div>
      </div>
    )
  }

  if (!loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-gray-500 text-center">
          <div className="text-lg font-medium mb-2">No products found</div>
          <div className="text-sm">Try adjusting your filters or search terms</div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {loading
        ? Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))
        : products.map((product) => (
            <ProductCard key={product.id} product={product} lang={lang || defaultLocale} dictionary={dictionary} />
          ))}
    </div>
  )
}
