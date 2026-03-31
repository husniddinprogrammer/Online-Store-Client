'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FooterBottom } from '@/components/layout/FooterBottom'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useCartQuery, useRemoveCartItem, useUpdateCartItem } from '@/lib/hooks/useCart'
import { useLocalCartStore } from '@/lib/store/cartStore'
import { useAuthStore } from '@/lib/store/authStore'
import { useMe, useAddresses, useCreateOrder } from '@/lib/hooks/useProfile'
import { useToastStore } from '@/lib/store/toastStore'
import { getDictionary, type Locale, type Dictionary } from '@/lib/i18n'

interface CartPageProps {
  params: Promise<{ lang: string }>
}

function formatUZS(n: number) {
  return n.toLocaleString() + ' сум'
}

// ── Order confirmation modal ──────────────────────────────────────────────────

interface ConfirmOrderModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (addressId: number) => void
  totalAmount: number
  balance: number
  addresses: { id: number; regionType: string; cityType: string; homeNumber: string; roomNumber: string }[]
  isPending: boolean
  lang: string
}

function ConfirmOrderModal({
  open,
  onClose,
  onConfirm,
  totalAmount,
  balance,
  addresses,
  isPending,
  lang,
}: ConfirmOrderModalProps) {
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    addresses[0]?.id ?? null
  )

  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === null) {
      setSelectedAddressId(addresses[0].id)
    }
  }, [addresses, selectedAddressId])

  const canAfford = balance >= totalAmount
  const remaining = balance - totalAmount

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 16 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="pointer-events-auto w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Buyurtmani tasdiqlash
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="px-6 py-5 flex flex-col gap-5">
                {/* Balance info */}
                <div className={`rounded-xl p-4 flex flex-col gap-2 ${canAfford ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Balans</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{formatUZS(balance)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Buyurtma summasi</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{formatUZS(totalAmount)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between text-sm font-bold">
                    <span className="text-gray-700 dark:text-gray-300">{canAfford ? 'Qoladi' : 'Yetishmaydi'}</span>
                    <span className={canAfford ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {formatUZS(Math.abs(remaining))}
                    </span>
                  </div>
                </div>

                {!canAfford && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-red-700 dark:text-red-400">Balans yetarli emas</p>
                      <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">
                        Buyurtma berish uchun balansni <Link href={`/${lang}/profile/personal-data`} className="underline font-medium" onClick={onClose}>to'ldiring</Link>.
                      </p>
                    </div>
                  </div>
                )}

                {/* Address selector */}
                {canAfford && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Yetkazib berish manzili</p>
                    {addresses.length === 0 ? (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-sm text-yellow-700 dark:text-yellow-400">
                        Manzil topilmadi.{' '}
                        <Link href={`/${lang}/profile/personal-data`} className="underline font-medium" onClick={onClose}>
                          Manzil qo'shing
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {addresses.map((addr) => (
                          <label
                            key={addr.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                              selectedAddressId === addr.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                            }`}
                          >
                            <input
                              type="radio"
                              name="address"
                              value={addr.id}
                              checked={selectedAddressId === addr.id}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="accent-blue-600"
                            />
                            <span className="text-sm text-gray-800 dark:text-gray-200">
                              {addr.regionType}, {addr.cityType}, {addr.homeNumber}-uy, {addr.roomNumber}-xona
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={() => selectedAddressId && onConfirm(selectedAddressId)}
                  disabled={!canAfford || !selectedAddressId || isPending}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                      </svg>
                      Yuklanmoqda...
                    </>
                  ) : (
                    'Buyurtma berish'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CartPage({ params }: CartPageProps) {
  const { lang } = use(params)
  const [dict, setDict] = useState<Dictionary | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  useEffect(() => {
    getDictionary(lang as Locale).then(setDict)
  }, [lang])

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const { data: serverCart, isLoading } = useCartQuery()
  const removeItemMutation = useRemoveCartItem()
  const updateItemMutation = useUpdateCartItem()
  const { data: me } = useMe()
  const { data: addressList } = useAddresses()
  const createOrder = useCreateOrder()
  const addToast = useToastStore((s) => s.addToast)

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

  const items = isLoggedIn
    ? (serverCart?.items ?? []).map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.productName,
        image: item.productImageLink,
        price: item.productPrice,
        discountedPrice: item.productPrice,
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

  const balance = me?.balance ?? 0
  const canAfford = balance >= totalAmount

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

  const handleCheckout = () => {
    if (!isLoggedIn) {
      addToast('Buyurtma berish uchun tizimga kiring', 'error')
      return
    }
    setShowConfirm(true)
  }

  const handleConfirmOrder = async (addressId: number) => {
    try {
      await createOrder.mutateAsync({ addressId })
      setShowConfirm(false)
      setOrderSuccess(true)
      localClear()
      addToast('Buyurtmangiz muvaffaqiyatli qabul qilindi!', 'success')
    } catch {
      addToast('Buyurtma berishda xatolik yuz berdi', 'error')
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
              onClick={() => localClear()}
              className="text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              Savatni tozalash
            </button>
          )}
        </div>

        {/* Order success state */}
        {orderSuccess ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Buyurtma qabul qilindi!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
              Buyurtmangiz muvaffaqiyatli rasmiylashtirildi. Tez orada yetkazib beriladi.
            </p>
            <div className="flex gap-3">
              <Link
                href={`/${lang}/profile/orders`}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                Buyurtmalarim
              </Link>
              <Link
                href={`/${lang}`}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {dict.cart.continueShopping}
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
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
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-blue-600">
                        {formatUZS(item.discountedPrice || item.price)}
                      </span>
                      {item.discountPercent > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatUZS(item.price)}
                        </span>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleQuantity(item.id, item.productId, item.quantity - 1, item.isServer)}
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
                          onClick={() => handleQuantity(item.id, item.productId, item.quantity + 1, item.isServer)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {formatUZS(item.totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
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
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm sticky top-20 flex flex-col gap-4">
                <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                  Buyurtma
                </h2>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Mahsulotlar ({items.length} ta)</span>
                    <span>{formatUZS(items.reduce((s, i) => s + i.totalPrice, 0))}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-bold text-gray-900 dark:text-gray-100">
                    <span>{dict.cart.total}</span>
                    <span className="text-blue-600">{formatUZS(totalAmount)}</span>
                  </div>
                </div>

                {/* Balance status (logged-in users) */}
                {isLoggedIn && me && (
                  <div className={`rounded-xl px-4 py-3 text-sm flex items-center justify-between ${
                    canAfford
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                  }`}>
                    <span>Balans</span>
                    <span className="font-semibold">{formatUZS(balance)}</span>
                  </div>
                )}

                {isLoggedIn && !canAfford && (
                  <p className="text-xs text-red-500 dark:text-red-400 -mt-1">
                    Balans yetarli emas.{' '}
                    <Link href={`/${lang}/profile/personal-data`} className="underline font-medium">
                      To'ldirish
                    </Link>
                  </p>
                )}

                <button
                  onClick={handleCheckout}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    isLoggedIn && !canAfford
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {dict.cart.checkout}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer lang={lang} dictionary={dict} />
      <FooterBottom dictionary={dict} />

      {isLoggedIn && (
        <ConfirmOrderModal
          open={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleConfirmOrder}
          totalAmount={totalAmount}
          balance={balance}
          addresses={addressList ?? []}
          isPending={createOrder.isPending}
          lang={lang}
        />
      )}
    </>
  )
}
