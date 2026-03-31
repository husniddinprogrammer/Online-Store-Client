'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/store/authStore'
import { useUnseenCount } from '@/lib/hooks/useProfile'
import type { Dictionary } from '@/lib/i18n'

interface ProfileSidebarProps {
  lang: string
  dict: Dictionary
}

function UserCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

const navItems = (lang: string, dict: Dictionary) => [
  {
    href: `/${lang}/profile/personal-data`,
    label: dict.profile.personalData,
    icon: <UserCircleIcon />,
    key: 'personal-data',
  },
  {
    href: `/${lang}/profile/orders`,
    label: dict.profile.myOrders,
    icon: <BagIcon />,
    key: 'orders',
  },
  {
    href: `/${lang}/profile/favorites`,
    label: dict.profile.favorites,
    icon: <HeartIcon />,
    key: 'favorites',
  },
  {
    href: `/${lang}/profile/reviews`,
    label: dict.profile.myReviews,
    icon: <StarIcon />,
    key: 'reviews',
  },
  {
    href: `/${lang}/profile/notifications`,
    label: dict.profile.notifications,
    icon: <BellIcon />,
    key: 'notifications',
    badge: true,
  },
]

export function ProfileSidebar({ lang, dict }: ProfileSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()
  const logout = useAuthStore((s) => s.logout)
  const { data: unseenCount } = useUnseenCount()

  const handleLogout = () => {
    logout()
    queryClient.removeQueries({ queryKey: ['me'] })
    queryClient.removeQueries({ queryKey: ['addresses'] })
    queryClient.removeQueries({ queryKey: ['myOrders'] })
    queryClient.removeQueries({ queryKey: ['notifications'] })
    queryClient.removeQueries({ queryKey: ['unseenCount'] })
    setTimeout(() => {
      router.push(`/${lang}`)
    }, 100)
  }

  const items = navItems(lang, dict)

  // Determine active key from pathname
  const activeKey = items.find((item) => pathname.includes(item.key))?.key ?? ''

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-3 py-3 flex flex-col gap-1">
          {items.map((item) => {
            const isActive = pathname.includes(item.key)
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && unseenCount != null && unseenCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                    {unseenCount > 9 ? '9+' : unseenCount}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 px-3 py-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogoutIcon />
            <span>{dict.profile.logout}</span>
          </button>
        </div>
      </nav>

      {/* Mobile horizontal tab row */}
      <nav className="md:hidden flex overflow-x-auto gap-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-2 py-2 scrollbar-hide">
        {items.map((item) => {
          const isActive = pathname.includes(item.key)
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`relative flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {item.label}
              {item.badge && unseenCount != null && unseenCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">
                  {unseenCount > 9 ? '9+' : unseenCount}
                </span>
              )}
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors whitespace-nowrap ml-auto"
        >
          {dict.profile.logout}
        </button>
      </nav>
    </>
  )
}
