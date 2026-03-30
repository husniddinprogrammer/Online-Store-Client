'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { useToastStore } from '@/lib/store/toastStore'
import {
  useNotifications,
  useMarkSeen,
  useMarkAllSeen,
  useDeleteNotification,
} from '@/lib/hooks/useProfile'
import { Pagination } from '@/components/ui/Pagination'
import { getDictionary, type Locale, type Dictionary } from '@/lib/i18n'
import type { NotificationResponse } from '@/lib/api/types'

interface PageProps {
  params: Promise<{ lang: string }>
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  )
}

const TYPE_STYLES = {
  INFO: {
    icon: <InfoIcon />,
    iconBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    border: 'border-l-blue-500',
  },
  WARNING: {
    icon: <WarningIcon />,
    iconBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
    border: 'border-l-amber-500',
  },
  ERROR: {
    icon: <ErrorIcon />,
    iconBg: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
    border: 'border-l-red-500',
  },
} as const

function relativeTime(dateStr: string): string {
  const now = Date.now()
  // NotificationResponse doesn't have createdAt in the type, so we handle the dateStr gracefully
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''
  const diffMs = now - date.getTime()
  const diffMins = Math.floor(diffMs / 60_000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24) return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays} days ago`
}

function NotificationSkeleton() {
  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-4 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-xl w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-xl w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function NotificationsPage({ params }: PageProps) {
  const { lang } = use(params)
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    getDictionary(lang as Locale).then(setDict)
  }, [lang])

  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const addToast = useToastStore((s) => s.addToast)

  const [page, setPage] = useState(0)

  const { data, isLoading } = useNotifications({ page, size: 15 })
  const markSeen = useMarkSeen()
  const markAllSeen = useMarkAllSeen()
  const deleteNotification = useDeleteNotification()

  useEffect(() => {
    if (!isLoggedIn) router.replace(`/${lang}/login`)
  }, [isLoggedIn, lang, router])

  if (!dict) return null

  const notifications = data?.content ?? []
  const totalPages = data?.totalPages ?? 0
  const hasUnseen = notifications.some((n: NotificationResponse) => !n.isSeen)

  const handleMarkAllSeen = async () => {
    try {
      await markAllSeen.mutateAsync()
    } catch {
      addToast(dict.common.error, 'error')
    }
  }

  const handleMarkSeen = async (id: number) => {
    try {
      await markSeen.mutateAsync(id)
    } catch {
      // silent
    }
  }

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await deleteNotification.mutateAsync(id)
    } catch {
      addToast(dict.common.error, 'error')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {dict.profile.notifications}
        </h1>
        {hasUnseen && (
          <button
            onClick={handleMarkAllSeen}
            disabled={markAllSeen.isPending}
            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors disabled:opacity-50"
          >
            {dict.profile.markAllRead}
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {isLoading ? (
          <NotificationSkeleton />
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <svg className="w-16 h-16 text-gray-200 dark:text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {dict.profile.noNotifications}
            </h3>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {notifications.map((notification: NotificationResponse & { createdAt?: string }) => {
              const typeStyle = TYPE_STYLES[notification.type] ?? TYPE_STYLES.INFO
              return (
                <div
                  key={notification.id}
                  onClick={() => !notification.isSeen && handleMarkSeen(notification.id)}
                  className={`flex items-start gap-3 px-4 py-4 cursor-pointer transition-colors border-l-4 ${typeStyle.border} ${
                    notification.isSeen
                      ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                      : 'bg-blue-50/40 dark:bg-blue-900/10 hover:bg-blue-50/70 dark:hover:bg-blue-900/20'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${typeStyle.iconBg}`}>
                    {typeStyle.icon}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${notification.isSeen ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100 font-medium'}`}>
                      {notification.text}
                    </p>
                    {notification.createdAt && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {relativeTime(notification.createdAt)}
                      </p>
                    )}
                  </div>

                  {!notification.isSeen && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                  )}

                  <button
                    onClick={(e) => handleDelete(notification.id, e)}
                    disabled={deleteNotification.isPending}
                    className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                    aria-label="Delete"
                  >
                    <TrashIcon />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
