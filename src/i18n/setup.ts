import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '@/i18n/en.json'
import ru from '@/i18n/ru.json'
import uzCyrl from '@/i18n/uz-cyrl.json'
import uzLatn from '@/i18n/uz-latn.json'
import { defaultLocale } from '@/i18n'

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      'uz-cyrl': { translation: uzCyrl },
      'uz-latn': { translation: uzLatn },
    },
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    interpolation: {
      escapeValue: false,
    },
  })
}

export default i18n
