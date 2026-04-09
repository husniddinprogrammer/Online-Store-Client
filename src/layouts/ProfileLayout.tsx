import { Outlet, useParams } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FooterBottom } from '@/components/layout/FooterBottom'
import { ProfileSidebar } from '@/components/profile/ProfileSidebar'
import { ProfileProtection } from '@/components/profile/ProfileProtection'
import { defaultLocale } from '@/i18n'
import { useLocaleDictionary } from '@/routes/useLocaleDictionary'

export function ProfileLayout() {
  const { lang = defaultLocale } = useParams()
  const dict = useLocaleDictionary(lang)

  if (!dict) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <ProfileProtection lang={lang}>
      <Navbar lang={lang} dictionary={dict} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:hidden mb-4">
          <ProfileSidebar lang={lang} dict={dict} />
        </div>

        <div className="flex gap-6 items-start">
          <aside className="hidden md:block w-56 flex-shrink-0 sticky top-24">
            <ProfileSidebar lang={lang} dict={dict} />
          </aside>

          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </main>

      <Footer lang={lang} dictionary={dict} />
      <FooterBottom dictionary={dict} />
    </ProfileProtection>
  )
}
