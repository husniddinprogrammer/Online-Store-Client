import { Helmet } from 'react-helmet-async'
import { useLocation, useParams } from 'react-router-dom'
import { useCategory, useProduct } from '@/hooks/useProducts'
import { defaultLocale } from '@/i18n'
import { useLocaleDictionary } from '@/routes/useLocaleDictionary'

const SITE_NAME = 'Online Store'

function buildUrl(pathname: string, search: string) {
  if (typeof window === 'undefined') {
    return pathname
  }

  return `${window.location.origin}${pathname}${search}`
}

export function RouteSeo() {
  const location = useLocation()
  const { lang = defaultLocale, id } = useParams()
  const dict = useLocaleDictionary(lang)
  const productId =
    location.pathname.includes('/product/') && id ? Number.parseInt(id, 10) : NaN
  const categoryId =
    location.pathname.includes('/category/') && id && id !== 'all'
      ? Number.parseInt(id, 10)
      : NaN

  const { data: product } = useProduct(Number.isNaN(productId) ? 0 : productId)
  const { data: category } = useCategory(
    Number.isNaN(categoryId) ? undefined : categoryId
  )

  if (!dict) {
    return null
  }

  const pagePath = location.pathname.replace(/^\/[^/]+/, '') || '/'
  let title = SITE_NAME
  let description =
    'Premium online shopping experience with categories, favorites, and fast product discovery.'

  if (pagePath === '/') {
    title = `${dict.home.latestProducts} | ${SITE_NAME}`
    description = dict.home.bestSellingProducts
  } else if (pagePath.startsWith('/cart')) {
    title = `${dict.cart.title} | ${SITE_NAME}`
    description = dict.cart.emptyDesc
  } else if (pagePath.startsWith('/favorites')) {
    title = `${dict.favorites.title} | ${SITE_NAME}`
    description = dict.favorites.emptyDesc
  } else if (pagePath.startsWith('/login')) {
    title = `${dict.auth.login} | ${SITE_NAME}`
    description = `${dict.auth.loginBtn} ${SITE_NAME}`
  } else if (pagePath.startsWith('/register')) {
    title = `${dict.auth.register} | ${SITE_NAME}`
    description = `${dict.auth.registerBtn} ${SITE_NAME}`
  } else if (pagePath.startsWith('/forgot-password')) {
    title = `${dict.auth.resetPassword} | ${SITE_NAME}`
    description = dict.auth.forgotPassword
  } else if (pagePath.startsWith('/category/')) {
    title = `${category?.name ?? dict.home.categories} | ${SITE_NAME}`
    description = dict.category.productsCount.replace('{count}', String(category ? 1 : 0))
  } else if (pagePath.startsWith('/company/')) {
    title = `Company ${id ?? ''} | ${SITE_NAME}`
    description = `${SITE_NAME} company catalog`
  } else if (pagePath.startsWith('/product/')) {
    title = `${product?.name ?? dict.product.description} | ${SITE_NAME}`
    description =
      product?.description?.slice(0, 160) ??
      `${dict.product.reviews} and ${dict.product.similarProducts}`
  } else if (pagePath.startsWith('/profile/personal-data')) {
    title = `${dict.profile.personalData} | ${SITE_NAME}`
    description = dict.profile.editProfile
  } else if (pagePath.startsWith('/profile/orders')) {
    title = `${dict.profile.myOrders} | ${SITE_NAME}`
    description = dict.profile.orderStatusCol
  } else if (pagePath.startsWith('/profile/favorites')) {
    title = `${dict.profile.favorites} | ${SITE_NAME}`
    description = dict.favorites.emptyDesc
  } else if (pagePath.startsWith('/profile/reviews')) {
    title = `${dict.profile.myReviews} | ${SITE_NAME}`
    description = dict.profile.writeReview
  } else if (pagePath.startsWith('/profile/notifications')) {
    title = `${dict.profile.notifications} | ${SITE_NAME}`
    description = dict.profile.noNotifications
  }

  const url = buildUrl(location.pathname, location.search)

  return (
    <Helmet prioritizeSeoTags>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}
