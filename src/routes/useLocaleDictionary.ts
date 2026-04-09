import { useEffect, useState } from 'react'
import {
  defaultLocale,
  getDictionary,
  hasLocale,
  type Dictionary,
  type Locale,
} from '@/i18n'

export function useLocaleDictionary(lang?: string) {
  const [dict, setDict] = useState<Dictionary | null>(null)
  const safeLang = hasLocale(lang ?? '') ? (lang as Locale) : defaultLocale

  useEffect(() => {
    let active = true

    getDictionary(safeLang).then((value) => {
      if (active) {
        setDict(value)
      }
    })

    return () => {
      active = false
    }
  }, [safeLang])

  return dict
}
