import { useMemo } from 'react'
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams as useReactRouterSearchParams,
  type LinkProps as RouterLinkProps,
} from 'react-router-dom'

type LinkProps = Omit<RouterLinkProps, 'to'> & {
  href?: RouterLinkProps['to']
  to?: RouterLinkProps['to']
}

export function Link({ href, to, ...props }: LinkProps) {
  return <RouterLink to={to ?? href ?? '/'} {...props} />
}

export default Link

export function useRouter() {
  const navigate = useNavigate()

  return useMemo(
    () => ({
      push: (to: string) => navigate(to),
      replace: (to: string) => navigate(to, { replace: true }),
      back: () => navigate(-1),
    }),
    [navigate]
  )
}

export function usePathname() {
  return useLocation().pathname
}

export function useSearchParams() {
  return useReactRouterSearchParams()[0]
}

export { useLocation, useParams }
