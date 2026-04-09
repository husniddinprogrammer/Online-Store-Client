'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/router/navigation'
import { useAuthStore } from '@/store/authStore'
import { ViewerLogoutModal } from '@/components/profile/ViewerLogoutModal'

interface ProfileProtectionProps {
  children: React.ReactNode
  lang: string
}

export function ProfileProtection({ children, lang }: ProfileProtectionProps) {
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
      {showLogoutModal && <ViewerLogoutModal open={showLogoutModal} lang={lang} />}

      {!showLogoutModal && children}
    </>
  )
}
