'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { auth } from '@/lib/api/endpoints'
import { useAuthStore } from '@/lib/store/authStore'
import { getDictionary, type Locale, type Dictionary } from '@/lib/i18n'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface RegisterPageProps {
  params: Promise<{ lang: string }>
}

const registerSchema = z
  .object({
    name: z.string().min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak'),
    surname: z.string().min(2, 'Familiya kamida 2 ta belgidan iborat bo\'lishi kerak'),
    email: z.string().email('Noto\'g\'ri email format'),
    phone: z.string().optional(),
    birthday: z.string().optional(),
    password: z
      .string()
      .min(6, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
    confirmPassword: z.string().min(1, 'Parolni tasdiqlang'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Parollar mos kelmadi',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage({ params }: RegisterPageProps) {
  const { lang } = use(params)
  const router = useRouter()
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
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setServerError('')
    try {
      const response = await auth.register({
        name: data.name,
        surname: data.surname,
        email: data.email,
        password: data.password,
        phoneNumber: data.phone,
        birthdayAt: data.birthday,
      })
      setAuth(response.data.data)
      router.push(`/${lang}`)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Ro\'yxatdan o\'tishda xatolik yuz berdi'
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

  const fieldClass = (hasError: boolean) =>
    `px-4 py-3 rounded-xl border text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
      hasError
        ? 'border-red-400 dark:border-red-600'
        : 'border-gray-300 dark:border-gray-600'
    }`

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={`/${lang}`} className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            Online Store
          </Link>
          <h1 className="mt-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
            {dict.auth.register}
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Server error */}
            {serverError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-red-600 dark:text-red-400 text-sm">
                {serverError}
              </div>
            )}

            {/* Name + Surname */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {dict.auth.name}
                </label>
                <input
                  type="text"
                  autoComplete="given-name"
                  {...register('name')}
                  placeholder="Islom"
                  className={fieldClass(!!errors.name)}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {dict.auth.surname}
                </label>
                <input
                  type="text"
                  autoComplete="family-name"
                  {...register('surname')}
                  placeholder="Karimov"
                  className={fieldClass(!!errors.surname)}
                />
                {errors.surname && (
                  <p className="text-xs text-red-500">{errors.surname.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict.auth.email}
              </label>
              <input
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder="example@mail.com"
                className={fieldClass(!!errors.email)}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict.auth.phone}{' '}
                <span className="text-gray-400 text-xs">(ixtiyoriy)</span>
              </label>
              <input
                type="tel"
                autoComplete="tel"
                {...register('phone')}
                placeholder="+998 90 123 45 67"
                className={fieldClass(false)}
              />
            </div>

            {/* Birthday */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict.auth.birthday}{' '}
                <span className="text-gray-400 text-xs">(ixtiyoriy)</span>
              </label>
              <input
                type="date"
                {...register('birthday')}
                className={fieldClass(false)}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict.auth.password}
              </label>
              <input
                type="password"
                autoComplete="new-password"
                {...register('password')}
                placeholder="••••••••"
                className={fieldClass(!!errors.password)}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict.auth.confirmPassword}
              </label>
              <input
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword')}
                placeholder="••••••••"
                className={fieldClass(!!errors.confirmPassword)}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="!w-4 !h-4" />
                  {dict.common.loading}
                </>
              ) : (
                dict.auth.registerBtn
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {dict.auth.alreadyHaveAccount}{' '}
            <Link
              href={`/${lang}/login`}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              {dict.auth.loginBtn}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
