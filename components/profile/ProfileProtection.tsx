'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { ViewerLogoutModal } from '@/components/profile/ViewerLogoutModal'
import { getDictionary, type Locale, type Dictionary } from '@/lib/i18n'

interface ProfileProtectionProps {
  children: React.ReactNode
  lang: string
  dict: Dictionary
}

export function ProfileProtection({
  children,
  lang,
  dict,
}: ProfileProtectionProps) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const logout = useAuthStore((s) => s.logout)
  const [isAuthInitialized, setIsAuthInitialized] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  useEffect(() => {
    setIsAuthInitialized(true)
  }, [])

  useEffect(() => {
    if (isAuthInitialized && !isLoggedIn) {
      router.replace(`/${lang}/login`)
      return
    }

    if (isAuthInitialized && isLoggedIn && user?.role === 'VIEWER') {
      // Automatically logout the user
      logout()
      setShowLogoutModal(true)
    }
  }, [isLoggedIn, user, lang, router, isAuthInitialized, logout])

  if (!isAuthInitialized) {
    return null
  }

  return (
    <>
      {showLogoutModal && (
        <ViewerLogoutModal
          open={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          dictionary={dict}
          lang={lang}
        />
      )}
      
      {!showLogoutModal && children}
    </>
  )
}
