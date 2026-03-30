import { getDictionary, type Locale } from '@/lib/i18n'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FooterBottom } from '@/components/layout/FooterBottom'
import { ProfileSidebar } from '@/components/profile/ProfileSidebar'

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <>
      <Navbar lang={lang} dictionary={dict} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile: sidebar tabs above content */}
        <div className="md:hidden mb-4">
          <ProfileSidebar lang={lang} dict={dict} />
        </div>

        <div className="flex gap-6 items-start">
          {/* Desktop sidebar */}
          <aside className="hidden md:block w-56 flex-shrink-0 sticky top-24">
            <ProfileSidebar lang={lang} dict={dict} />
          </aside>

          {/* Page content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </main>

      <Footer lang={lang} dictionary={dict} />
      <FooterBottom dictionary={dict} />
    </>
  )
}
