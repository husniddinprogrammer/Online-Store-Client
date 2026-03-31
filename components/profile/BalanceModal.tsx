'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTopUp } from '@/lib/hooks/useProfile'
import { useToastStore } from '@/lib/store/toastStore'

const MIN = 10_000
const MAX = 10_000_000

const QUICK_AMOUNTS = [50_000, 100_000, 200_000, 500_000, 1_000_000]

interface BalanceModalProps {
  open: boolean
  onClose: () => void
  currentBalance: number
}

function formatUZS(n: number) {
  return n.toLocaleString('ru-RU') + ' сум'
}

export function BalanceModal({ open, onClose, currentBalance }: BalanceModalProps) {
  const [raw, setRaw] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const topUp = useTopUp()
  const addToast = useToastStore((s) => s.addToast)

  const amount = Number(raw.replace(/\D/g, ''))
  const isValid = amount >= MIN && amount <= MAX

  useEffect(() => {
    if (open) {
      setRaw('')
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleInput = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits === '') { setRaw(''); return }
    const num = Number(digits)
    if (num > MAX) return
    setRaw(num.toLocaleString('ru-RU'))
  }

  const handleSubmit = async () => {
    if (!isValid) return
    try {
      await topUp.mutateAsync(amount)
      addToast(`Balans muvaffaqiyatli to'ldirildi: ${formatUZS(amount)}`, 'success')
      onClose()
    } catch {
      addToast('Xatolik yuz berdi. Qayta urinib ko\'ring.', 'error')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 16 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="pointer-events-auto w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Balansni to'ldirish
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Joriy balans: <span className="font-semibold text-blue-600">{formatUZS(currentBalance)}</span>
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 flex flex-col gap-5">
                {/* Quick amounts */}
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Tez tanlash</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_AMOUNTS.map((q) => (
                      <button
                        key={q}
                        onClick={() => setRaw(q.toLocaleString('ru-RU'))}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
                          amount === q
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        {(q / 1000).toLocaleString()}K
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Miqdor (сум)
                  </label>
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      inputMode="numeric"
                      value={raw}
                      onChange={(e) => handleInput(e.target.value)}
                      placeholder={`${MIN.toLocaleString('ru-RU')} dan ${MAX.toLocaleString('ru-RU')} gacha`}
                      className={`w-full px-4 py-3 pr-14 rounded-xl border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 transition-colors text-sm ${
                        raw && !isValid
                          ? 'border-red-400 focus:ring-red-300'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500 pointer-events-none">
                      сум
                    </span>
                  </div>
                  {raw && !isValid && (
                    <p className="text-xs text-red-500">
                      {amount < MIN
                        ? `Minimum: ${formatUZS(MIN)}`
                        : `Maksimum: ${formatUZS(MAX)}`}
                    </p>
                  )}
                  {isValid && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      To'ldirilgandan keyin: <span className="font-semibold">{formatUZS(currentBalance + amount)}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isValid || topUp.isPending}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {topUp.isPending ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                      </svg>
                      Yuklanmoqda...
                    </>
                  ) : (
                    "To'ldirish"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
