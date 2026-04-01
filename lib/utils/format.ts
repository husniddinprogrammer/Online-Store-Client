import { defaultLocale, hasLocale } from '@/lib/i18n'

const numberLocales = {
  'uz-cyrl': 'uz-UZ',
  'uz-latn': 'uz-UZ',
  'ru': 'ru-RU',
  'en': 'en-US',
} as const

const currencyLabels = {
  'uz-cyrl': 'сўм',
  'uz-latn': "so'm",
  'ru': 'сум',
  'en': 'UZS',
} as const

export function formatCurrency(amount: number, locale: string = defaultLocale): string {
  const safeLocale = hasLocale(locale) ? locale : defaultLocale
  return `${amount.toLocaleString(numberLocales[safeLocale])} ${currencyLabels[safeLocale]}`
}
