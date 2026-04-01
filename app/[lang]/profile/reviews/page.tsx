'use client'

import { use, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { useMyReviews, usePendingReviews } from '@/lib/hooks/useProfile'
import { useProduct } from '@/lib/hooks/useProducts'
import { img } from '@/lib/utils/img'
import { StarRating } from '@/components/ui/StarRating'
import { ReviewModal } from '@/components/profile/ReviewModal'
import { getDictionary, type Locale, type Dictionary } from '@/lib/i18n'
import type { CommentResponse, ProductResponse } from '@/lib/api/types'

interface PageProps {
  params: Promise<{ lang: string }>
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex gap-4 animate-pulse">
      <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  )
}

// ── ReviewedCard — a submitted review ─────────────────────────────────────────

function ReviewedCard({ review, lang }: { review: CommentResponse; lang: string }) {
  const { data: product } = useProduct(review.productId)
  const mainImage =
    product?.images?.find((i) => i.isMain)?.imageLink ??
    product?.images?.[0]?.imageLink ??
    null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex gap-4">
      {/* Product thumbnail */}
      <Link href={`/${lang}/product/${review.productId}`} className="flex-shrink-0">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
          {mainImage ? (
            <Image
              src={img(mainImage) ?? ''}
              alt={product?.name ?? ''}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link
            href={`/${lang}/product/${review.productId}`}
            className="font-semibold text-gray-900 dark:text-gray-100 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
          >
            {product?.name ?? `#${review.productId}`}
          </Link>
          <span className="text-xs text-gray-400 flex-shrink-0">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>

        {product?.category && (
          <p className="text-xs text-gray-400 mb-1">{product.category.name}</p>
        )}

        <StarRating rating={review.rating} size="sm" />

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed line-clamp-3">
          {review.text}
        </p>
      </div>
    </div>
  )
}

// ── PendingCard — product awaiting review ─────────────────────────────────────

function PendingCard({
  product,
  lang,
  dict,
  onWrite,
}: {
  product: ProductResponse
  lang: string
  dict: Dictionary
  onWrite: (p: { id: number; name: string }) => void
}) {
  const mainImage =
    product.images?.find((i) => i.isMain)?.imageLink ?? product.images?.[0]?.imageLink ?? null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 flex items-center gap-4">
      {/* Thumbnail */}
      <Link href={`/${lang}/product/${product.id}`} className="flex-shrink-0">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/${lang}/product/${product.id}`}
          className="font-semibold text-gray-900 dark:text-gray-100 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 block"
        >
          {product.name}
        </Link>
        {product.category && (
          <p className="text-xs text-gray-400 mt-0.5">{product.category.name}</p>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={() => onWrite({ id: product.id, name: product.name })}
        className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        {dict.profile.writeReview}
      </button>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({
  icon,
  title,
  action,
}: {
  icon: React.ReactNode
  title: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
      <div className="text-gray-300 dark:text-gray-600">{icon}</div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      {action}
    </div>
  )
}

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">{title}</h2>
      {count !== undefined && count > 0 && (
        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
          {count}
        </span>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ReviewsPage({ params }: PageProps) {
  const { lang } = use(params)
  const [dict, setDict] = useState<Dictionary | null>(null)
  const [isAuthInitialized, setIsAuthInitialized] = useState(false)
  const [reviewTarget, setReviewTarget] = useState<{ id: number; name: string } | null>(null)

  useEffect(() => {
    getDictionary(lang as Locale).then(setDict)
  }, [lang])

  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
    setIsAuthInitialized(true)
  }, [initialize])

  useEffect(() => {
    if (isAuthInitialized && !isLoggedIn) {
      router.replace(`/${lang}/login`)
    }
  }, [isLoggedIn, lang, router, isAuthInitialized])

  const { data: reviewsData, isLoading: reviewsLoading } = useMyReviews()
  const { data: pendingData, isLoading: pendingLoading } = usePendingReviews()

  if (!dict) return null

  const reviewed = reviewsData?.content ?? []
  const notReviewed = pendingData?.content ?? []

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {dict.profile.myReviews}
      </h1>

      <div className="flex flex-col gap-8">
        {/* ── My reviews ── */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <SectionHeader title={dict.profile.myReviews} count={reviewed.length} />

          {reviewsLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : reviewed.length === 0 ? (
            <EmptyState
              icon={
                <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              }
              title={dict.profile.noReviews}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {reviewed.map((r) => (
                <ReviewedCard key={r.id} review={r} lang={lang} />
              ))}
            </div>
          )}
        </section>

        {/* ── Pending reviews ── */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <SectionHeader title={dict.profile.pendingReviews} count={notReviewed.length} />

          {pendingLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(2)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : notReviewed.length === 0 ? (
            <EmptyState
              icon={
                <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title={dict.profile.noPendingReviews}
              action={
                <Link
                  href={`/${lang}`}
                  className="mt-1 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  {dict.cart.continueShopping}
                </Link>
              }
            />
          ) : (
            <div className="flex flex-col gap-3">
              {notReviewed.map((p) => (
                <PendingCard
                  key={p.id}
                  product={p}
                  lang={lang}
                  dict={dict}
                  onWrite={setReviewTarget}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Review modal */}
      {reviewTarget && (
        <ReviewModal
          open={true}
          onClose={() => setReviewTarget(null)}
          product={reviewTarget}
          dict={dict}
        />
      )}
    </>
  )
}
