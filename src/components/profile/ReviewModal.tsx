'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSubmitReview } from '@/hooks/useProfile'
import { useToastStore } from '@/store/toastStore'
import type { Dictionary } from '@/i18n'
import { getApiErrorMessage } from '@/utils/apiError'

// ── Interactive star rating input ─────────────────────────────────────────────

function StarInput({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${star} star`}
          className="transition-transform hover:scale-110 focus:outline-none focus-visible:scale-110"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill={star <= active ? '#f59e0b' : 'none'}
            stroke={star <= active ? '#f59e0b' : '#d1d5db'}
            strokeWidth="1.5"
            className="transition-colors duration-100"
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </button>
      ))}
    </div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ReviewModalProps {
  open: boolean
  onClose: () => void
  product: { id: number; name: string }
  dict: Dictionary
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ReviewModal({ open, onClose, product, dict }: ReviewModalProps) {
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const submitReview = useSubmitReview()
  const addToast = useToastStore((s) => s.addToast)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setRating(5)
      setText('')
      setTimeout(() => textareaRef.current?.focus(), 150)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || rating === 0) return
    try {
      await submitReview.mutateAsync({ productId: product.id, rating, text: text.trim() })
      addToast(dict.profile.reviewSubmitted, 'success')
      onClose()
    } catch (error) {
      addToast(getApiErrorMessage(error, dict.common.error), 'error')
    }
  }

  const isValid = text.trim().length > 0 && rating > 0

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal card */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 z-10"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="pr-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {dict.profile.writeReview}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                  {product.name}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={dict.common.close}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {dict.profile.yourRating}
                </label>
                <StarInput value={rating} onChange={setRating} />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {dict.profile.yourComment}
                </label>
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm transition-colors"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {dict.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitReview.isPending || !isValid}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {submitReview.isPending ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      {dict.common.loading}
                    </>
                  ) : (
                    dict.common.save
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
