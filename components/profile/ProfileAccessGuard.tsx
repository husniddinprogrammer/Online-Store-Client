'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { Dictionary } from '@/lib/i18n'

interface ProfileAccessGuardProps {
  lang: string
  dict: Dictionary
  children: React.ReactNode
}

function getStoredRole() {
  if (typeof window === 'undefined') return null

  try {
    const rawUser = localStorage.getItem('user')
    if (!rawUser) return null
    const user = JSON.parse(rawUser) as { role?: string }
    return user.role ?? null
  } catch {
    return null
  }
}

export function ProfileAccessGuard({
  lang,
  dict,
  children,
}: ProfileAccessGuardProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const userRole = useAuthStore((s) => s.user?.role)

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const currentRole = userRole ?? getStoredRole()

  if (currentRole !== 'VIEWER') {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-950/20 p-6 sm:p-7">
        <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6" />
            <path d="M9 9l6 6" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {dict.profile.viewerAccessDeniedTitle}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {dict.profile.viewerAccessDeniedMessage}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {dict.profile.viewerAccessDeniedHint}
        </p>

        <Link
          href={`/${lang}`}
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 active:bg-blue-700"
        >
          {dict.profile.goHome}
        </Link>
      </div>
    </div>
  )
}
