import { useId } from 'react'

interface StarRatingProps {
  rating: number
  count?: number
  size?: 'sm' | 'md'
}

export function StarRating({ rating, count, size = 'md' }: StarRatingProps) {
  const gradientId = useId()
  const starSize = size === 'sm' ? 14 : 18

  const renderStar = (index: number) => {
    const filled = rating - index
    let fillPercent = 0
    if (filled >= 1) fillPercent = 100
    else if (filled > 0) fillPercent = Math.round(filled * 100)

    const id = `${gradientId}-${index}`

    return (
      <svg
        key={index}
        width={starSize}
        height={starSize}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={id}>
            <stop offset={`${fillPercent}%`} stopColor="#f59e0b" />
            <stop offset={`${fillPercent}%`} stopColor="#d1d5db" />
          </linearGradient>
        </defs>
        <polygon
          points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
          fill={`url(#${id})`}
          stroke="#f59e0b"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => renderStar(i))}
      </div>
      {count !== undefined && (
        <span
          className={`text-gray-500 dark:text-gray-400 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}
        >
          ({count})
        </span>
      )}
    </div>
  )
}
