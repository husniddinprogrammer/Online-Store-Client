'use client'

import { useRef } from 'react'
import { CategoryCard } from '@/components/ui/CategoryCard'
import type { CategoryResponse } from '@/lib/api/types'

interface CategoryCarouselProps {
  categories: CategoryResponse[]
  lang: string
}

export function CategoryCarousel({ categories, lang }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.7
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  // Filter out categories that have no products
  const filteredCategories = categories.filter(category => 
    category.productCount === undefined || category.productCount > 0
  )

  if (!filteredCategories.length) return null

  return (
    <div className="relative group">
      {/* Left arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Scroll left"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15,18 9,12 15,6" />
        </svg>
      </button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
      >
        {filteredCategories.map((cat) => (
          <div key={cat.id} className="flex-none">
            <CategoryCard category={cat} lang={lang} />
          </div>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Scroll right"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9,18 15,12 9,6" />
        </svg>
      </button>
    </div>
  )
}
