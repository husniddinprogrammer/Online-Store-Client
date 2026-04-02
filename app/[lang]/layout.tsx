import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, locales, type Locale } from '@/lib/i18n'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { AuthInitializer } from '@/components/providers/AuthInitializer'
import { Toaster } from '@/components/ui/Toaster'

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

interface LangLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params

  if (!hasLocale(lang)) {
    notFound()
  }

  const dict = await getDictionary(lang as Locale)

  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthInitializer />
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0f1e]" suppressHydrationWarning>
          {children}
        </div>
        <Toaster />
      </QueryProvider>
    </ThemeProvider>
  )
}
