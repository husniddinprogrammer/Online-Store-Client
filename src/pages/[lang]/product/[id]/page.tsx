'use client'

import { use, useState, useEffect } from 'react'
import Image from '@/components/ui/AppImage'
import Link from '@/router/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FooterBottom } from '@/components/layout/FooterBottom'
import { ProductCard } from '@/components/ui/ProductCard'
import { StarRating } from '@/components/ui/StarRating'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { useProduct, useProducts, useComments } from '@/hooks/useProducts'
import { useToggleFavorite } from '@/hooks/useFavorites'
import { useAuthStore } from '@/store/authStore'
import { useLocalCartStore } from '@/store/cartStore'
import { useAddToCart, useCartQuery } from '@/hooks/useCart'
import { useReviewEligibility, useSubmitReview } from '@/hooks/useProfile'
import { useToastStore } from '@/store/toastStore'
import { getDictionary, type Locale, type Dictionary } from '@/i18n'
import { img } from '@/utils/img'
import { formatCurrency } from '@/utils/format'
import { getApiErrorMessage } from '@/utils/apiError'

interface ProductPageProps {
  params: Promise<{ lang: string; id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { lang, id } = use(params)
  const productId = parseInt(id, 10)
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    getDictionary(lang as Locale).then(setDict)
  }, [lang])

  const { data: product, isLoading, isError, refetch } = useProduct(productId)
  const { data: commentsData } = useComments(productId, { size: 10 })
  const { data: similarData } = useProducts({
    categoryId: product?.category?.id,
    size: 8,
  })

  const [activeImage, setActiveImage] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [commentRating, setCommentRating] = useState(5)

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const { data: eligibility } = useReviewEligibility(productId)
  const submitReview = useSubmitReview()
  const addToast = useToastStore((s) => s.addToast)
  const canReview = (eligibility?.delivered && !eligibility?.commented) ?? false
  const { isFavorite, toggle: toggleFavorite } = useToggleFavorite(productId)
  const localAddItem = useLocalCartStore((s) => s.addItem)
  const addToCartMutation = useAddToCart()
  const { data: serverCart } = useCartQuery()
  const localCart = useLocalCartStore((s) => s.items)

  if (!dict) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <>
        <Navbar lang={lang} dictionary={dict} />
        <div className="flex-1 flex items-center justify-center py-24">
          <LoadingSpinner size="lg" />
        </div>
      </>
    )
  }

  if (isError || !product) {
    return (
      <>
        <Navbar lang={lang} dictionary={dict} />
        <div className="flex-1">
          <ErrorState
            message={dict.common.error}
            retryLabel={dict.common.retry}
            onRetry={refetch}
          />
        </div>
      </>
    )
  }

  const images = product.images ?? []
  const mainImageUrl = img(
    images[activeImage]?.imageLink ?? images.find((i) => i.isMain)?.imageLink ?? null
  )

  const inLocalCart = localCart.some((i) => i.productId === productId)
  const inServerCart = (serverCart?.items ?? []).some((i) => i.productId === productId)
  const isInCart = isLoggedIn ? inServerCart : inLocalCart
  const inStock = product.stockQuantity > 0
  const commentCount = commentsData?.totalElements ?? 0
  const stockLabel = inStock
    ? dict.product.inStockCount.replace('{count}', String(product.stockQuantity))
    : dict.product.outOfStock

  const handleAddToCart = () => {
    if (isLoggedIn) {
      addToCartMutation.mutate({ productId, quantity: 1 })
    } else {
      localAddItem({
        productId,
        quantity: 1,
        name: product.name,
        price: product.sellPrice,
        image: mainImageUrl ?? '',
        discountPercent: product.discountPercent,
        discountedPrice: product.discountedPrice,
      })
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    try {
      await submitReview.mutateAsync({
        productId,
        rating: commentRating,
        text: commentText.trim(),
      })

      setCommentText('')
      setCommentRating(5)
      addToast(dict.profile.reviewSubmitted, 'success')
    } catch (error) {
      addToast(getApiErrorMessage(error, dict.common.error), 'error')
    }
  }

  const commentsList = commentsData?.content ?? []
  const similarProducts = similarData?.content.filter((p) => p.id !== productId) ?? []

  return (
    <>
      <Navbar lang={lang} dictionary={dict} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link
            href={`/${lang}`}
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            {dict.footer.home}
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link
                href={`/${lang}/category/${product.category.id}`}
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-800 dark:text-gray-200 line-clamp-1">
            {product.name}
          </span>
        </nav>

        {/* Section 1: Rating row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <StarRating rating={product.averageRating} count={commentCount} size="md" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {commentCount} {dict.product.reviews}
            </span>
          </div>
          <button
            onClick={toggleFavorite}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
              isFavorite
                ? 'border-red-300 text-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-red-300 hover:text-red-500'
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {isFavorite ? dict.product.removeFromFavorites : dict.product.addToFavorites}
          </button>
        </div>

        {/* Section 2: Main product info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Image gallery */}
          <div className="lg:col-span-1 flex flex-col gap-3">
            {/* Main image */}
            <div
              className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800"
              style={{ aspectRatio: '1/1' }}
            >
              {mainImageUrl ? (
                <Image
                  src={mainImageUrl}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              {product.discountPercent > 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{product.discountPercent}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((image, i) => (
                  <button
                    key={image.id}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === activeImage
                        ? 'border-blue-600'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <Image
                      src={img(image.imageLink) ?? ''}
                      alt={`${product.name} ${i + 1}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="lg:col-span-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {product.name}
            </h1>
            {product.company && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {product.company.name}
              </p>
            )}
            {product.description && (
              <div className="prose dark:prose-invert prose-sm max-w-none">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {dict.product.description}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* Price + cart */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm sticky top-20">
              {/* Price */}
              <div className="mb-5">
                {product.discountPercent > 0 ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-bold text-blue-600">
                      {formatCurrency(product.discountedPrice, lang)}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {formatCurrency(product.sellPrice, lang)}
                    </span>
                    <span className="inline-block text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full w-fit">
                      -{product.discountPercent}% {dict.product.discount}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(product.sellPrice, lang)}
                  </span>
                )}
              </div>

              {/* Stock */}
              <p
                className={`text-sm mb-5 font-medium ${inStock ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}
              >
                {stockLabel}
              </p>

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock || addToCartMutation.isPending}
                className={`w-full py-3 px-6 rounded-xl text-base font-semibold transition-colors flex items-center justify-center gap-2 ${
                  !inStock
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : isInCart
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-2 border-green-500'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {!inStock
                  ? dict.product.outOfStock
                  : isInCart
                    ? dict.product.inCart
                    : dict.product.addToCart}
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Comments */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {dict.product.reviews} ({commentCount})
          </h2>

          {/* Add comment form � only for buyers */}
          {isLoggedIn && canReview && (
            <form
              onSubmit={handleSubmitComment}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm"
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                {dict.profile.writeReview}
              </h3>
              {/* Star rating input */}
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setCommentRating(star)}
                    className={`text-2xl transition-transform hover:scale-110 ${star <= commentRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={dict.profile.yourComment}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              />
              <button
                type="submit"
                disabled={submitReview.isPending || !commentText.trim()}
                className="mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {submitReview.isPending ? dict.common.loading : dict.common.save}
              </button>
            </form>
          )}

          {/* Non-buyer notice */}
          {isLoggedIn && !canReview && (
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 mb-6">
              <svg
                className="w-5 h-5 text-gray-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dict.profile.onlyBuyersReview}
              </p>
            </div>
          )}

          {/* Comments list */}
          <div className="flex flex-col gap-4">
            {commentsList.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm py-4">
                {dict.product.noReviews}
              </p>
            ) : (
              commentsList.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                        {comment.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {comment.userName} {comment.userSurname}
                        </p>
                        <StarRating rating={comment.rating} size="sm" />
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Section 4: Similar products */}
        {similarProducts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5">
              {dict.product.similarProducts}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similarProducts.slice(0, 5).map((p) => (
                <ProductCard key={p.id} product={p} lang={lang} dictionary={dict} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer lang={lang} dictionary={dict} />
      <FooterBottom dictionary={dict} />
    </>
  )
}
