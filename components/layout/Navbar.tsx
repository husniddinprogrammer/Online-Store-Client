'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useAuthStore } from '@/lib/store/authStore'
import { useLocalCartStore } from '@/lib/store/cartStore'
import { useLocalFavoritesStore } from '@/lib/store/favoritesStore'
import { useCartQuery } from '@/lib/hooks/useCart'
import { useCategoriesWithProducts } from '@/lib/hooks/useProducts'
import { locales, localeNames } from '@/lib/i18n'
import { img } from '@/lib/utils/img'
import type { Locale } from '@/lib/i18n'
import type { Dictionary } from '@/lib/i18n'

interface NavbarProps {
  lang: string
  dictionary: Dictionary
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export function Navbar({ lang, dictionary }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCatalog, setShowCatalog] = useState(false)
  const [showLang, setShowLang] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const catalogRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)

  const user = useAuthStore((s) => s.user)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const localCartItems = useLocalCartStore((s) => s.items)
  const localFavorites = useLocalFavoritesStore((s) => s.productIds)
  const { data: serverCart } = useCartQuery()
  const { data: categoriesData } = useCategoriesWithProducts({ size: 20 })

  useEffect(() => setMounted(true), [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catalogRef.current && !catalogRef.current.contains(e.target as Node)) {
        setShowCatalog(false)
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLang(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const cartCount = isLoggedIn
    ? serverCart?.totalItems ?? 0
    : localCartItems.reduce((s, i) => s + i.quantity, 0)

  const favoritesCount = isLoggedIn ? 0 : localFavorites.length

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/${lang}?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLanguageChange = (locale: Locale) => {
    setShowLang(false)
    // Replace locale segment in current path
    const segments = pathname.split('/')
    segments[1] = locale
    router.push(segments.join('/'))
  }

  const categories = categoriesData?.content ?? []
  
  // Filter out categories that have no products
  const filteredCategories = categories.filter((category: any) => 
    category.productCount === undefined || category.productCount > 0
  )

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm shadow-slate-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-3">
          {/* Logo */}
          <Link
            href={`/${lang}`}
            className="flex-shrink-0 mr-2 text-xl font-bold gradient-text tracking-tight"
          >
            Online Store
          </Link>

          {/* Catalog button */}
          <div className="relative hidden md:block" ref={catalogRef}>
            <button
              onClick={() => setShowCatalog((v) => !v)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold transition-all duration-150 shadow-sm shadow-blue-600/30 hover:shadow-blue-500/40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              {dictionary.nav.catalog}
            </button>

            {showCatalog && (
              <div className="absolute top-full left-0 mt-2 w-[520px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200/70 dark:border-slate-700/60 p-5 z-50">
                <div className="grid grid-cols-4 gap-2">
                  {filteredCategories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/${lang}/category/${cat.id}`}
                      onClick={() => setShowCatalog(false)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all duration-150 text-center group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-300 dark:group-hover:ring-blue-700 transition-all">
                        {cat.imageLink ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img(cat.imageLink) ?? ''} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 transition-colors">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 hidden md:flex">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={dictionary.nav.search + '...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-500 transition-all"
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-0.5 ml-auto">
            {/* Dark mode toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-150"
                aria-label={dictionary.nav.darkMode}
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
            )}

            {/* Language switcher */}
            <div className="relative hidden md:block" ref={langRef}>
              <button
                onClick={() => setShowLang((v) => !v)}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-150"
                aria-label={dictionary.nav.language}
              >
                <GlobeIcon />
              </button>

              {showLang && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200/70 dark:border-slate-700/60 overflow-hidden z-50">
                  {locales.map((locale) => (
                    <button
                      key={locale}
                      onClick={() => handleLanguageChange(locale)}
                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                        locale === lang
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {localeNames[locale]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Favorites */}
            <Link
              href={`/${lang}/favorites`}
              className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-500 dark:hover:text-red-400 transition-all duration-150 hidden md:flex"
              aria-label={dictionary.nav.favorites}
            >
              <HeartIcon />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold px-1">
                  {favoritesCount > 9 ? '9+' : favoritesCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href={`/${lang}/cart`}
              className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-150 hidden md:flex"
              aria-label={dictionary.nav.cart}
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold px-1">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Profile / Login */}
            {isLoggedIn && user ? (
              <Link
                href={`/${lang}/profile`}
                className="hidden md:flex ml-1 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white items-center justify-center font-bold text-sm hover:from-blue-400 hover:to-blue-600 transition-all shadow-sm shadow-blue-600/30"
                aria-label={dictionary.nav.profile}
              >
                {user.name.charAt(0).toUpperCase()}
              </Link>
            ) : (
              <Link
                href={`/${lang}/login`}
                className="hidden md:flex items-center gap-2 px-4 py-2 ml-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-sm shadow-blue-600/30"
              >
                <UserIcon />
                <span className="hidden lg:inline">{dictionary.nav.login}</span>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 md:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200/60 dark:border-slate-800/60 mt-1">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="py-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={dictionary.nav.search + '...'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </div>
            </form>

            <div className="flex flex-col gap-0.5">
              <Link
                href={`/${lang}/cart`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
              >
                <CartIcon />
                {dictionary.nav.cart}
                {cartCount > 0 && (
                  <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">{cartCount}</span>
                )}
              </Link>
              <Link
                href={`/${lang}/favorites`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
              >
                <HeartIcon />
                {dictionary.nav.favorites}
              </Link>
              {isLoggedIn ? (
                <Link
                  href={`/${lang}/profile`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                >
                  <UserIcon />
                  {dictionary.nav.profile}
                </Link>
              ) : (
                <Link
                  href={`/${lang}/login`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                >
                  <UserIcon />
                  {dictionary.nav.login}
                </Link>
              )}

              {/* Mobile language switcher */}
              <div className="px-3 pt-3 mt-1 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{dictionary.nav.language}</p>
                <div className="flex gap-2">
                  {locales.map((locale) => (
                    <button
                      key={locale}
                      onClick={() => {
                        handleLanguageChange(locale)
                        setMobileOpen(false)
                      }}
                      className={`flex-1 text-xs py-2 rounded-xl font-semibold transition-colors ${
                        locale === lang
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {localeNames[locale]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
