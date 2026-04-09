'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from '@/components/ui/AppImage'
import { img } from '@/utils/img'
import { motion, AnimatePresence } from 'framer-motion'
import { posters as postersApi } from '@/services/api/endpoints'
import type { PosterResponse } from '@/services/api/types'

interface PosterCarouselProps {
  posters: PosterResponse[]
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

export function PosterCarousel({ posters }: PosterCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const goTo = useCallback(
    (index: number, dir = 1) => {
      setDirection(dir)
      setCurrent((index + posters.length) % posters.length)
    },
    [posters.length]
  )

  const prev = () => goTo(current - 1, -1)
  const next = useCallback(() => goTo(current + 1, 1), [current, goTo])

  useEffect(() => {
    if (posters.length <= 1) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next, posters.length])

  const handleClick = (poster: PosterResponse) => {
    postersApi.clickPoster(poster.id).catch(() => {})
    if (poster.link) window.open(poster.link, '_blank', 'noopener,noreferrer')
  }

  if (!posters.length) {
    return (
      <div className="w-full aspect-[16/9] xl:aspect-auto xl:h-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl overflow-hidden flex items-center justify-center text-white">
        <p className="text-xl font-bold">Online Store</p>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-[16/9] xl:aspect-auto xl:h-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'tween', duration: 0.4 }}
          className="absolute inset-0 cursor-pointer"
          onClick={() => handleClick(posters[current])}
        >
          <Image
            src={img(posters[current].imageLink) ?? ''}
            alt={`Poster ${posters[current].id}`}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {posters.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-10"
            aria-label="Previous"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors z-10"
            aria-label="Next"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>
        </>
      )}

      {posters.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {posters.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className={`h-2 rounded-full transition-all ${
                i === current ? 'bg-white w-5' : 'bg-white/50 w-2 hover:bg-white/80'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
