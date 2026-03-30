'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useToastStore } from '@/lib/store/toastStore'
import type { Toast } from '@/lib/store/toastStore'

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast)

  const styles = {
    success: {
      container: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700',
      icon: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400',
      text: 'text-green-800 dark:text-green-200',
      close: 'text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-200',
    },
    error: {
      container: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700',
      icon: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-400',
      text: 'text-red-800 dark:text-red-200',
      close: 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200',
    },
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700',
      icon: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400',
      text: 'text-blue-800 dark:text-blue-200',
      close: 'text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200',
    },
  }

  const s = styles[toast.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`flex items-start gap-3 w-full max-w-sm rounded-xl border shadow-lg px-4 py-3 ${s.container}`}
      role="alert"
    >
      <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${s.icon}`}>
        {toast.type === 'success' && <CheckIcon />}
        {toast.type === 'error' && <AlertIcon />}
        {toast.type === 'info' && <InfoIcon />}
      </span>
      <p className={`flex-1 text-sm font-medium leading-snug ${s.text}`}>
        {toast.message}
      </p>
      <button
        onClick={() => removeToast(toast.id)}
        className={`flex-shrink-0 mt-0.5 transition-colors ${s.close}`}
        aria-label="Close"
      >
        <CloseIcon />
      </button>
    </motion.div>
  )
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 items-end pointer-events-none"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
