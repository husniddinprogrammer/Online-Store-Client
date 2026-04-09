import { useParams } from 'react-router-dom'
import { defaultLocale, hasLocale } from '@/i18n'
import HomePage from '@/pages/[lang]/page'
import CartPage from '@/pages/[lang]/cart/page'
import FavoritesPage from '@/pages/[lang]/favorites/page'
import LoginPage from '@/pages/[lang]/login/page'
import RegisterPage from '@/pages/[lang]/register/page'
import ForgotPasswordPage from '@/pages/[lang]/forgot-password/page'
import CategoryPage from '@/pages/[lang]/category/[id]/page'
import CompanyPage from '@/pages/[lang]/company/[id]/page'
import ProductPage from '@/pages/[lang]/product/[id]/page'
import ProfilePersonalDataPage from '@/pages/[lang]/profile/personal-data/page'
import ProfileOrdersPage from '@/pages/[lang]/profile/orders/page'
import ProfileFavoritesPage from '@/pages/[lang]/profile/favorites/page'
import ProfileReviewsPage from '@/pages/[lang]/profile/reviews/page'
import ProfileNotificationsPage from '@/pages/[lang]/profile/notifications/page'

type RouteParams = Record<string, string | undefined>

function makeParamsPromise<T extends RouteParams>(
  params: T
): Promise<Record<string, string>> {
  const safeParams = Object.fromEntries(
    Object.entries(params).filter((entry): entry is [string, string] => !!entry[1])
  )

  return Promise.resolve(safeParams)
}

function useSafeLang() {
  const { lang } = useParams()
  return hasLocale(lang ?? '') ? lang : defaultLocale
}

export function HomeRoute() {
  const lang = useSafeLang()
  return <HomePage params={makeParamsPromise({ lang })} />
}

export function CartRoute() {
  const lang = useSafeLang()
  return <CartPage params={makeParamsPromise({ lang })} />
}

export function FavoritesRoute() {
  const lang = useSafeLang()
  return <FavoritesPage params={makeParamsPromise({ lang })} />
}

export function LoginRoute() {
  const lang = useSafeLang()
  return <LoginPage params={makeParamsPromise({ lang })} />
}

export function RegisterRoute() {
  const lang = useSafeLang()
  return <RegisterPage params={makeParamsPromise({ lang })} />
}

export function ForgotPasswordRoute() {
  const lang = useSafeLang()
  return <ForgotPasswordPage params={makeParamsPromise({ lang })} />
}

export function CategoryRoute() {
  const lang = useSafeLang()
  const { id = 'all' } = useParams()
  return <CategoryPage params={makeParamsPromise({ lang, id })} />
}

export function CompanyRoute() {
  const lang = useSafeLang()
  const { id = '' } = useParams()
  return <CompanyPage params={makeParamsPromise({ lang, id })} />
}

export function ProductRoute() {
  const lang = useSafeLang()
  const { id = '' } = useParams()
  return <ProductPage params={makeParamsPromise({ lang, id })} />
}

export function ProfilePersonalDataRoute() {
  const lang = useSafeLang()
  return <ProfilePersonalDataPage params={makeParamsPromise({ lang })} />
}

export function ProfileOrdersRoute() {
  const lang = useSafeLang()
  return <ProfileOrdersPage params={makeParamsPromise({ lang })} />
}

export function ProfileFavoritesRoute() {
  const lang = useSafeLang()
  return <ProfileFavoritesPage params={makeParamsPromise({ lang })} />
}

export function ProfileReviewsRoute() {
  const lang = useSafeLang()
  return <ProfileReviewsPage params={makeParamsPromise({ lang })} />
}

export function ProfileNotificationsRoute() {
  const lang = useSafeLang()
  return <ProfileNotificationsPage params={makeParamsPromise({ lang })} />
}
