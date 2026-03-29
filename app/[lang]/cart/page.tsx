'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FooterBottom } from '@/components/layout/FooterBottom'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useCartQuery, useRemoveCartItem, useUpdateCartItem, useClearCart } from '@/lib/hooks/useCart'
import { useLocalCartStore } from '@/lib/store/cartStore'
import { useAuthStore } from '@/lib/store/authStore'
import { getDictionary, type Locale, type Dictionary } from '@/lib/i18n'

interface CartPageProps {
  params: Promise<{ lang: string }>
}

export default function CartPage({ params }: CartPageProps) {
  const { lang } = use(params)
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    getDictionary(lang as Locale).then(setDict)
  }, [lang])

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const { data: serverCart, isLoading } = useCartQuery()
  const removeItemMutation = useRemoveCartItem()
  const updateItemMutation = useUpdateCartItem()

  const localItems = useLocalCartStore((s) => s.items)
  const localRemove = useLocalCartStore((s) => s.removeItem)
  const localUpdate = useLocalCartStore((s) => s.updateQuantity)
  const localClear = useLocalCartStore((s) => s.clearCart)

  if (!dict) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isLoggedIn && isLoading) {
    return (
      <>
        <Navbar lang={lang} dictionary={dict} />
        <div className="flex-1 flex items-center justify-center py-24">
          <LoadingSpinner size="lg" />
        </div>
      </>
    )
  }

  // Determine which data to show
  const items = isLoggedIn
    ? (serverCart?.items ?? []).map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.productName,
        image: item.productImageLink,
        price: item.productPrice,
        discountedPrice: item.productPrice, // API cart item has no separate discounted price
        discountPercent: 0,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        isServer: true,
      }))
    : localItems.map((item) => ({
        id: item.productId,
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        discountedPrice: item.discountedPrice,
        discountPercent: item.discountPercent,
        quantity: item.quantity,
        totalPrice: (item.discountedPrice || item.price) * item.quantity,
        isServer: false,
      }))

  const totalAmount = isLoggedIn
    ? serverCart?.totalAmount ?? 0
    : localItems.reduce((s, i) => s + (i.discountedPrice || i.price) * i.quantity, 0)

  const handleRemove = (itemId: number, productId: number, isServer: boolean) => {
    if (isServer) {
      removeItemMutation.mutate(itemId)
    } else {
      localRemove(productId)
    }
  }

  const handleQuantity = (
    itemId: number,
    productId: number,
    quantity: number,
    isServer: boolean
  ) => {
    if (quantity < 1) return
    if (isServer) {
      updateItemMutation.mutate({ itemId, payload: { quantity } })
    } else {
      localUpdate(productId, quantity)
    }
  }

  const handleClearCart = () => {
    if (isLoggedIn) {
      // clear via API (handled by dedicated clear cart hook if needed)
    } else {
      localClear()
    }
  }

  return (
    <>
      <Navbar lang={lang} dictionary={dict} />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {dict.cart.title}
          </h1>
          {items.length > 0 && !isLoggedIn && (
            <button
              onClick={handleClearCart}
              className="text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              Savatni tozalash
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg
              className="w-20 h-20 text-gray-200 dark:text-gray-700 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {dict.cart.empty}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
              {dict.cart.emptyDesc}
            </p>
            <Link
              href={`/${lang}`}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              {dict.cart.continueShopping}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart items */}
            <div className="flex-1 flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.id}`}
                  className="flex gap-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
                >
                  {/* Image */}
                  <Link href={`/${lang}/product/${item.productId}`}>
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-600" />
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/${lang}/product/${item.productId}`}>
                      <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    {/* Price */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-blue-600">
                        {(item.discountedPrice || item.price).toLocaleString()} сум
                      </span>
                      {item.discountPercent > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                          {item.price.toLocaleString()} сум
                        </span>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            handleQuantity(item.id, item.productId, item.quantity - 1, item.isServer)
                          }
                          className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                        <span className="w-10 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantity(item.id, item.productId, item.quantity + 1, item.isServer)
                          }
                          className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {item.totalPrice.toLocaleString()} сум
                      </span>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(item.id, item.productId, item.isServer)}
                    className="flex-shrink-0 w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center"
                    aria-label={dict.cart.remove}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm sticky top-20">
                <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-5">
                  Buyurtma
                </h2>

                <div className="flex flex-col gap-3 mb-5">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Mahsulotlar ({items.length} ta)</span>
                    <span>{items.reduce((s, i) => s + i.totalPrice, 0).toLocaleString()} сум</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-bold text-gray-900 dark:text-gray-100">
                    <span>{dict.cart.total}</span>
                    <span className="text-blue-600">{totalAmount.toLocaleString()} сум</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">
                  {dict.cart.checkout}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer lang={lang} dictionary={dict} />
      <FooterBottom dictionary={dict} />
    </>
  )
}
