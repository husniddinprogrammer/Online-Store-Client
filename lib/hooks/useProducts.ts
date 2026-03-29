import { useQuery } from '@tanstack/react-query'
import { products, categories, posters, comments, companies } from '@/lib/api/endpoints'
import type { ProductsParams, CategoriesParams, CommentsParams, CompaniesParams } from '@/lib/api/endpoints'

export function useProducts(params?: ProductsParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => products.getProducts(params).then((r) => r.data.data),
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => products.getProduct(id).then((r) => r.data.data),
    enabled: !!id,
  })
}

export function useCategories(params?: CategoriesParams) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => categories.getCategories(params).then((r) => r.data.data),
    staleTime: 5 * 60 * 1000, // 5 minutes — categories don't change often
  })
}

export function usePosters() {
  return useQuery({
    queryKey: ['posters'],
    queryFn: () => posters.getPosters({ size: 10 }).then((r) => r.data.data),
    staleTime: 10 * 60 * 1000,
  })
}

export function useComments(productId: number, params?: CommentsParams) {
  return useQuery({
    queryKey: ['comments', productId, params],
    queryFn: () => comments.getComments(productId, params).then((r) => r.data.data),
    enabled: !!productId,
  })
}

export function useCompanies(params?: CompaniesParams) {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => companies.getCompanies(params).then((r) => r.data.data),
  })
}
