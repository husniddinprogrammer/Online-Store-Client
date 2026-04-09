import { ThemeProvider as AppThemeProvider } from '@/theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <AppThemeProvider>{children}</AppThemeProvider>
}
