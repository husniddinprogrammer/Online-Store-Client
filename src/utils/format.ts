import { defaultLocale, hasLocale } from '@/i18n'

const numberLocales = {
  'uz-cyrl': 'uz-UZ',
  'uz-latn': 'uz-UZ',
  ru: 'ru-RU',
  en: 'en-US',
} as const

const currencyLabels = {
  'uz-cyrl': '\u0441\u045e\u043c',
  'uz-latn': "so'm",
  ru: '\u0441\u0443\u043c',
  en: 'UZS',
} as const

export function formatCurrency(amount: number, locale: string = defaultLocale): string {
  const safeLocale = hasLocale(locale) ? locale : defaultLocale
  return `${amount.toLocaleString(numberLocales[safeLocale])} ${currencyLabels[safeLocale]}`
}
