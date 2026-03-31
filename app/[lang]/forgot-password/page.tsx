'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { auth } from '@/lib/api/endpoints'
import { getDictionary, type Locale, type Dictionary } from '@/lib/i18n'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface ForgotPasswordPageProps {
  params: Promise<{ lang: string }>
}

const forgotPasswordSchema = z.object({
  email: z.string().email('Noto\'g\'ri email format'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
  const { lang } = use(params)
  const [dict, setDict] = useState<Dictionary | null>(null)
  const [serverError, setServerError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    getDictionary(lang as Locale).then(setDict)
  }, [lang])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError('')
    try {
      await auth.forgotPassword(data)
      setIsSuccess(true)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Parolni tiklashda xatolik yuz berdi'
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

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href={`/${lang}`} className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              Online Store
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Email yuborildi
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Parolni tiklash bo'yicha ko'rsatmalar sizning emailingizga yuborildi.
                Iltimos, pochtangizni tekshiring.
              </p>
              <Link
                href={`/${lang}/login`}
                className="inline-flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
              >
                {dict.auth.backToLogin}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={`/${lang}`} className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            Online Store
          </Link>
          <h1 className="mt-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
            {dict.auth.forgotPassword}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Parolingizni tiklash uchun emailingizni kiriting
          </p>
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
                dict.auth.resetPassword
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <Link
              href={`/${lang}/login`}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              {dict.auth.backToLogin}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
