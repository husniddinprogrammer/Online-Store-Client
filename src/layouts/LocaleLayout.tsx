import { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import i18n from '@/i18n/setup'
import { defaultLocale, hasLocale } from '@/i18n'
import { RouteSeo } from '@/seo/RouteSeo'

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, search])

  return null
}

export function LocaleLayout() {
  const { lang } = useParams()
  const location = useLocation()

  useEffect(() => {
    if (lang && hasLocale(lang) && i18n.language !== lang) {
      void i18n.changeLanguage(lang)
    }
  }, [lang])

  if (!lang || !hasLocale(lang)) {
    const segments = location.pathname.split('/').filter(Boolean)
    if (segments.length > 0) {
      segments[0] = defaultLocale
    }
    const nextPath = segments.length ? `/${segments.join('/')}` : `/${defaultLocale}`
    return <Navigate to={`${nextPath}${location.search}`} replace />
  }

  return (
    <>
      <ScrollToTop />
      <RouteSeo />
      <Outlet />
    </>
  )
}
