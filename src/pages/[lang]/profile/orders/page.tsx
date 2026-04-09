'use client'

import React, { use, useState, useEffect } from 'react'
import Link from '@/router/navigation'
import { useRouter } from '@/router/navigation'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'
import { useMyOrders, useCancelOrder } from '@/hooks/useProfile'
import { Pagination } from '@/components/ui/Pagination'
import { getDictionary, type Locale, type Dictionary } from '@/i18n'
import type { OrderResponse, OrderItemResponse } from '@/services/api/types'
import { formatCurrency } from '@/utils/format'

interface PageProps {
  params: Promise<{ lang: string }>
}

const STATUS_TABS = [
  'ALL',
  'PENDING',
  'PAID',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
] as const
type StatusTab = (typeof STATUS_TABS)[number]

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  PAID: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  SHIPPED: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  DELIVERED:
    'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  CANCELLED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
}

// -- Order items expanded panel ------------------------------------------------

function OrderItemsPanel({ items, lang }: { items: OrderItemResponse[]; lang: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 px-4 py-3 flex flex-col gap-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3">
          {/* Name */}
          <Link
            href={`/${lang}/product/${item.productId}`}
            className="flex-1 min-w-0 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
          >
            {item.productName}
          </Link>

          {/* Qty x price */}
          <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {item.quantity} x {formatCurrency(item.price, lang)}
          </span>

          {/* Item total */}
          <span className="flex-shrink-0 text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap min-w-[90px] text-right">
            {formatCurrency(item.totalPrice, lang)}
          </span>
        </div>
      ))}
    </div>
  )
}

function OrderSkeleton() {
  return (
    <div className="animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
        >
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full ml-auto" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      ))}
    </div>
  )
}

function EmptyOrders({ dict }: { dict: Dictionary }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        className="w-20 h-20 text-gray-200 dark:text-gray-700 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
        {dict.profile.noOrders}
      </h3>
    </div>
  )
}

export default function OrdersPage({ params }: PageProps) {
  const { lang } = use(params)
  const [dict, setDict] = useState<Dictionary | null>(null)
  const [isAuthInitialized, setIsAuthInitialized] = useState(false)

  useEffect(() => {
    getDictionary(lang as Locale).then(setDict)
  }, [lang])

  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const initialize = useAuthStore((s) => s.initialize)
  const addToast = useToastStore((s) => s.addToast)

  useEffect(() => {
    initialize()
    setIsAuthInitialized(true)
  }, [initialize])

  const [activeStatus, setActiveStatus] = useState<StatusTab>('ALL')
  const [page, setPage] = useState(0)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggleExpand = (id: number) => setExpandedId((prev) => (prev === id ? null : id))

  const { data, isLoading } = useMyOrders({
    status: activeStatus === 'ALL' ? undefined : activeStatus,
    page,
    size: 10,
  })
  const cancelOrder = useCancelOrder()

  useEffect(() => {
    if (isAuthInitialized && !isLoggedIn) {
      router.replace(`/${lang}/login`)
    }
  }, [isLoggedIn, lang, router, isAuthInitialized])

  if (!dict) return null

  const orders = data?.content ?? []
  const totalPages = data?.totalPages ?? 0

  const handleTabChange = (status: StatusTab) => {
    setActiveStatus(status)
    setPage(0)
  }

  const handleCancel = async (id: number) => {
    try {
      await cancelOrder.mutateAsync(id)
      addToast(dict.common.save, 'success')
    } catch {
      addToast(dict.common.error, 'error')
    }
  }

  const statusLabel = (status: string) => {
    const key = `orderStatus_${status}` as keyof typeof dict.profile
    return (dict.profile[key] as string) ?? status
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {dict.profile.myOrders}
      </h1>

      {/* Status filter tabs */}
      <div className="flex overflow-x-auto gap-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-2 py-2 scrollbar-hide">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => handleTabChange(s)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
              activeStatus === s
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {s === 'ALL' ? 'All' : statusLabel(s)}
          </button>
        ))}
      </div>

      {/* Orders table / cards */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {isLoading ? (
          <OrderSkeleton />
        ) : orders.length === 0 ? (
          <EmptyOrders dict={dict} />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">
                      {dict.profile.orderId}
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">
                      {dict.profile.orderDate}
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">
                      {dict.profile.orderStatusCol}
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">
                      Items
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">
                      {dict.profile.orderTotal}
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: OrderResponse) => {
                    const isExpanded = expandedId === order.id
                    const hasItems = (order.items?.length ?? 0) > 0
                    return (
                      <React.Fragment key={order.id}>
                        <tr className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                            #{order.id}
                          </td>
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] ?? ''}`}
                            >
                              {statusLabel(order.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {hasItems ? (
                              <button
                                onClick={() => toggleExpand(order.id)}
                                className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {order.items.length} ta
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                >
                                  <polyline points="6 9 12 15 18 9" />
                                </svg>
                              </button>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                            {formatCurrency(order.totalAmount, lang)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {order.status === 'PENDING' && (
                              <button
                                onClick={() => handleCancel(order.id)}
                                disabled={cancelOrder.isPending}
                                className="px-3 py-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm transition-colors disabled:opacity-50"
                              >
                                {dict.profile.cancelOrder}
                              </button>
                            )}
                          </td>
                        </tr>
                        {isExpanded && hasItems && (
                          <tr
                            key={`${order.id}-items`}
                            className="border-b border-gray-100 dark:border-gray-700"
                          >
                            <td colSpan={6} className="p-0">
                              <OrderItemsPanel items={order.items} lang={lang} />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
              {orders.map((order: OrderResponse) => {
                const isExpanded = expandedId === order.id
                const hasItems = (order.items?.length ?? 0) > 0
                return (
                  <div key={order.id} className="flex flex-col">
                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          #{order.id}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] ?? ''}`}
                        >
                          {statusLabel(order.status)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        {hasItems && (
                          <button
                            onClick={() => toggleExpand(order.id)}
                            className="flex items-center gap-1 text-blue-600 dark:text-blue-400"
                          >
                            {order.items.length} ta mahsulot
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(order.totalAmount, lang)}
                        </span>
                        {order.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            disabled={cancelOrder.isPending}
                            className="px-3 py-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm transition-colors disabled:opacity-50"
                          >
                            {dict.profile.cancelOrder}
                          </button>
                        )}
                      </div>
                    </div>
                    {isExpanded && hasItems && (
                      <OrderItemsPanel items={order.items} lang={lang} />
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {!isLoading && totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}
