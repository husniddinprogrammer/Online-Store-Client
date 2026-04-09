'use client'

import { use, useState, useEffect } from 'react'
import Link from '@/router/navigation'
import { useRouter } from '@/router/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { auth } from '@/services/api/endpoints'
import { useAuthStore } from '@/store/authStore'
import { getDictionary, type Locale, type Dictionary } from '@/i18n'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface LoginPageProps {
  params: Promise<{ lang: string }>
}

const loginSchema = z.object({
  email: z.string().email("Noto'g'ri email format"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage({ params }: LoginPageProps) {
  const { lang } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [dict, setDict] = useState<Dictionary | null>(null)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    getDictionary(lang as Locale).then(setDict)
  }, [lang])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError('')
    try {
      const authData = await auth.login(data)
      setAuth(authData)
      queryClient.invalidateQueries({ queryKey: ['me'] })
      router.push(`/${lang}/profile`)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Login yoki parol noto'g'ri"
      setServerError(message)
    }
  }

  if (!dict) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href={`/${lang}`}
            className="text-3xl font-bold text-blue-600 dark:text-blue-400"
          >
            Online Store
          </Link>
          <h1 className="mt-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
            {dict.auth.login}
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Server error */}
            {serverError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-red-600 dark:text-red-400 text-sm">
                {serverError}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {dict.auth.email}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder="example@mail.com"
                className={`px-4 py-3 rounded-xl border text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.email
                    ? 'border-red-400 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {dict.auth.password}
                </label>
                <Link
                  href={`/${lang}/forgot-password`}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {dict.auth.forgotPassword}
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                placeholder="********"
                className={`px-4 py-3 rounded-xl border text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.password
                    ? 'border-red-400 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="!w-4 !h-4" />
                  {dict.common.loading}
                </>
              ) : (
                dict.auth.loginBtn
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {dict.auth.dontHaveAccount}{' '}
            <Link
              href={`/${lang}/register`}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              {dict.auth.register}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
