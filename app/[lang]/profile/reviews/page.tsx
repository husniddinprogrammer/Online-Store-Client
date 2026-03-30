'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { getDictionary, type Locale, type Dictionary } from '@/lib/i18n'

interface PageProps {
  params: Promise<{ lang: string }>
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? '#f59e0b' : 'none'}
      stroke={filled ? '#f59e0b' : '#d1d5db'}
      strokeWidth="2"
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
    </svg>
  )
}

export default function ReviewsPage({ params }: PageProps) {
  const { lang } = use(params)
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    getDictionary(lang as Locale).then(setDict)
  }, [lang])

  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  useEffect(() => {
    if (!isLoggedIn) router.replace(`/${lang}/login`)
  }, [isLoggedIn, lang, router])

  if (!dict) return null

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {dict.profile.myReviews}
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center py-20 px-4 text-center">
        {/* Star illustration */}
        <div className="flex items-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled={i < 3} />
          ))}
        </div>

        <svg
          className="w-16 h-16 text-gray-200 dark:text-gray-700 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>

        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {dict.profile.noReviews}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm text-sm leading-relaxed">
          Share your experience with products you have purchased. Your reviews help other customers make informed decisions.
        </p>

        <Link
          href={`/${lang}`}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors text-sm"
        >
          {dict.cart.continueShopping}
        </Link>
      </div>
    </div>
  )
}
