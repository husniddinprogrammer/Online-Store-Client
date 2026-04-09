import { useParams } from 'react-router-dom'
import Link from '@/router/navigation'
import { defaultLocale } from '@/i18n'
import { useLocaleDictionary } from '@/routes/useLocaleDictionary'

export default function NotFoundPage() {
  const { lang = defaultLocale } = useParams()
  const dict = useLocaleDictionary(lang)

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="max-w-xl text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
          404
        </p>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
          Page not found
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400 leading-7">
          The page you requested does not exist or the link is no longer valid.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            {dict?.profile.goHome ?? 'Go Home'}
          </Link>
        </div>
      </div>
    </main>
  )
}
