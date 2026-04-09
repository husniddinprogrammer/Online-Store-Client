import { useQuery } from '@tanstack/react-query'
import {
  products,
  categories,
  posters,
  comments,
  companies,
} from '@/services/api/endpoints'
import type {
  ProductsParams,
  CategoriesParams,
  CommentsParams,
  CompaniesParams,
} from '@/services/api/endpoints'

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

export function useCategory(id: number | undefined) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categories.getCategory(id!).then((r) => r.data.data),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCategories(params?: CategoriesParams) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => categories.getCategories(params).then((r) => r.data.data),
    staleTime: 5 * 60 * 1000, // 5 minutes — categories don't change often
  })
}

export function useCategoriesWithProducts(params?: CategoriesParams) {
  return useQuery({
    queryKey: ['categories-with-products', params],
    queryFn: async () => {
      const categoriesResponse = await categories.getCategories(params)
      const categoriesData = categoriesResponse.data.data.content

      // Fetch product count for each category
      const categoriesWithCounts = await Promise.all(
        categoriesData.map(async (category) => {
          try {
            const productsResponse = await products.getProducts({
              categoryId: category.id,
              size: 1,
            })
            const productCount = productsResponse.data.data.totalElements
            return {
              ...category,
              productCount,
            }
          } catch (error) {
            console.error(
              `Error fetching product count for category ${category.id}:`,
              error
            )
            return {
              ...category,
              productCount: 0,
            }
          }
        })
      )

      return {
        ...categoriesResponse.data.data,
        content: categoriesWithCounts,
      }
    },
    staleTime: 5 * 60 * 1000,
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
