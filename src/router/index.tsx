import { Suspense, lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { defaultLocale } from '@/i18n'
import { LocaleLayout } from '@/layouts/LocaleLayout'
import { ProfileLayout } from '@/layouts/ProfileLayout'

const HomeRoute = lazy(() =>
  import('@/routes/pages').then((m) => ({ default: m.HomeRoute }))
)
const CartRoute = lazy(() =>
  import('@/routes/pages').then((m) => ({ default: m.CartRoute }))
)
const FavoritesRoute = lazy(() =>
  import('@/routes/pages').then((m) => ({ default: m.FavoritesRoute }))
)
const LoginRoute = lazy(() =>
  import('@/routes/pages').then((m) => ({ default: m.LoginRoute }))
)
const RegisterRoute = lazy(() =>
  import('@/routes/pages').then((m) => ({ default: m.RegisterRoute }))
)
const ForgotPasswordRoute = lazy(() =>
  import('@/routes/pages').then((m) => ({ default: m.ForgotPasswordRoute }))
)
const CategoryRoute = lazy(() =>
  import('@/routes/pages').then((m) => ({ default: m.CategoryRoute }))
)
const CompanyRoute = lazy(() =>
  import('@/routes/pages').then((m) => ({ default: m.CompanyRoute }))
)
const ProductRoute = lazy(() =>
  import('@/routes/pages').then((m) => ({ default: m.ProductRoute }))
)
const ProfilePersonalDataRoute = lazy(() =>
  import('@/routes/pages').then((m) => ({ default: m.ProfilePersonalDataRoute }))
)
const ProfileOrdersRoute = lazy(() =>
  import('@/routes/pages').then((m) => ({ default: m.ProfileOrdersRoute }))
)
const ProfileFavoritesRoute = lazy(() =>
  import('@/routes/pages').then((m) => ({ default: m.ProfileFavoritesRoute }))
)
const ProfileReviewsRoute = lazy(() =>
  import('@/routes/pages').then((m) => ({ default: m.ProfileReviewsRoute }))
)
const ProfileNotificationsRoute = lazy(() =>
  import('@/routes/pages').then((m) => ({ default: m.ProfileNotificationsRoute }))
)
const NotFoundRoute = lazy(() => import('@/pages/not-found/NotFoundPage'))

function RouteFallback() {
  return (
    <div className="flex-1 flex items-center justify-center py-24">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
    </div>
  )
}

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={`/${defaultLocale}`} replace />,
  },
  {
    path: '/:lang',
    element: <LocaleLayout />,
    children: [
      {
        index: true,
        element: withSuspense(<HomeRoute />),
      },
      {
        path: 'cart',
        element: withSuspense(<CartRoute />),
      },
      {
        path: 'favorites',
        element: withSuspense(<FavoritesRoute />),
      },
      {
        path: 'login',
        element: withSuspense(<LoginRoute />),
      },
      {
        path: 'register',
        element: withSuspense(<RegisterRoute />),
      },
      {
        path: 'forgot-password',
        element: withSuspense(<ForgotPasswordRoute />),
      },
      {
        path: 'category/:id',
        element: withSuspense(<CategoryRoute />),
      },
      {
        path: 'company/:id',
        element: withSuspense(<CompanyRoute />),
      },
      {
        path: 'product/:id',
        element: withSuspense(<ProductRoute />),
      },
      {
        path: 'profile',
        element: <ProfileLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="personal-data" replace />,
          },
          {
            path: 'personal-data',
            element: withSuspense(<ProfilePersonalDataRoute />),
          },
          {
            path: 'orders',
            element: withSuspense(<ProfileOrdersRoute />),
          },
          {
            path: 'favorites',
            element: withSuspense(<ProfileFavoritesRoute />),
          },
          {
            path: 'reviews',
            element: withSuspense(<ProfileReviewsRoute />),
          },
          {
            path: 'notifications',
            element: withSuspense(<ProfileNotificationsRoute />),
          },
        ],
      },
      {
        path: '*',
        element: withSuspense(<NotFoundRoute />),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={`/${defaultLocale}`} replace />,
  },
])
