'use client'

import { useEffect, useRef, useState } from 'react'
import { ProductCard } from '@/components/ui/ProductCard'
import type { ProductResponse } from '@/services/api/types'
import type { Dictionary } from '@/i18n'

interface ProductCarouselProps {
  products: ProductResponse[]
  lang: string
  dict: Dictionary
}

export function ProductCarousel({ products, lang, dict }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const updateScrollState = () => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth
      setCanScrollLeft(container.scrollLeft > 8)
      setCanScrollRight(container.scrollLeft < maxScrollLeft - 8)
    }

    updateScrollState()
    container.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      container.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [products.length])

  const scroll = (dir: 'left' | 'right') => {
    const container = scrollRef.current
    if (!container) return

    const firstCard = container.querySelector<HTMLElement>('[data-carousel-item="product"]')
    const gap = Number.parseFloat(window.getComputedStyle(container).gap || '16') || 16
    const cardWidth = firstCard?.getBoundingClientRect().width ?? container.clientWidth * 0.8
    const visibleCards = Math.max(
      1,
      Math.floor((container.clientWidth + gap) / (cardWidth + gap))
    )
    const amount = visibleCards * (cardWidth + gap)

    container.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  if (!products.length) return null

  return (
    <div className="relative group">
      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className={`absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-x-3 -translate-y-1/2 items-center justify-center rounded-full border shadow-md transition-all md:flex ${
          canScrollLeft
            ? 'border-gray-200 bg-white text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            : 'cursor-not-allowed border-gray-200 bg-white/80 text-gray-300 opacity-0 dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-700'
        }`}
        aria-label="Scroll left"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="15,18 9,12 15,6" />
        </svg>
      </button>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-carousel-item="product"
            className="w-[240px] flex-none snap-start sm:w-[260px] lg:w-[280px]"
          >
            <ProductCard product={product} lang={lang} dictionary={dict} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={`absolute right-0 top-1/2 z-10 hidden h-10 w-10 translate-x-3 -translate-y-1/2 items-center justify-center rounded-full border shadow-md transition-all md:flex ${
          canScrollRight
            ? 'border-gray-200 bg-white text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            : 'cursor-not-allowed border-gray-200 bg-white/80 text-gray-300 opacity-0 dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-700'
        }`}
        aria-label="Scroll right"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="9,18 15,12 9,6" />
        </svg>
      </button>
    </div>
  )
}
