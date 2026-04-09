'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from '@/router/navigation'

interface ViewerLogoutModalProps {
  open: boolean
  lang: string
}

const modalTexts = {
  en: {
    title: 'Access Restricted',
    message:
      'Viewer role users cannot access profile pages. You have been automatically logged out for security reasons.',
    buttonText: 'Go to Homepage',
  },
  ru: {
    title: 'Доступ ограничен',
    message:
      'Пользователи с ролью Viewer не могут получить доступ к страницам профиля. Вы были автоматически вышли из системы по соображениям безопасности.',
    buttonText: 'Перейти на главную',
  },
  uz: {
    title: 'Kirish cheklandi',
    message:
      "Viewer roldagi foydalanuvchilar profil sahifalariga kira olmaydi. Xavfsizlik sabablariga ko'ra siz avtomatik ravishda tizimdan chiqarildingiz.",
    buttonText: "Asosiy sahifaga o'tish",
  },
  kr: {
    title: 'Кириш чекланган',
    message:
      'Viewer ролидаги фойдаланувчилар профиль саҳифаларига кира олмайди. Хавфсизлик сабабларига кўра сиз автоматик равишда тизимдан чиқарилдингиз.',
    buttonText: 'Асосий саҳифага ўтиш',
  },
}

export function ViewerLogoutModal({ open, lang }: ViewerLogoutModalProps) {
  const router = useRouter()

  const texts = modalTexts[lang as keyof typeof modalTexts] || modalTexts.en

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.push(`/${lang}`)
      }
    }

    if (open) {
      document.addEventListener('keydown', handler)
    }

    return () => document.removeEventListener('keydown', handler)
  }, [open, router, lang])

  const handleGoHome = () => {
    router.push(`/${lang}`)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleGoHome}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 16 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="pointer-events-auto w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 pt-6 pb-5 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-red-600 dark:text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>

                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {texts.title}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {texts.message}
                </p>
              </div>

              <div className="px-6 pb-6">
                <button
                  onClick={handleGoHome}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  {texts.buttonText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
