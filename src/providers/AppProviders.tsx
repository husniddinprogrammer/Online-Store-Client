import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { QueryProvider } from '@/providers/QueryProvider'
import { AuthInitializer } from '@/providers/AuthInitializer'
import { Toaster } from '@/components/ui/Toaster'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <QueryProvider>
          <AuthInitializer />
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0f1e]">
            {children}
          </div>
          <Toaster />
        </QueryProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
