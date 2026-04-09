import type { Dictionary } from '@/i18n'

interface SortSelectProps {
  value: string
  onChange: (value: string) => void
  dictionary?: Dictionary['category']
}

export function SortSelect({ value, onChange, dictionary }: SortSelectProps) {
  const sortOptions = [
    { value: 'PRICE_ASC', label: dictionary?.priceLowToHigh ?? 'Price: Low to High' },
    { value: 'PRICE_DESC', label: dictionary?.priceHighToLow ?? 'Price: High to Low' },
    { value: 'NEWEST', label: dictionary?.newestFirst ?? 'Newest First' },
  ]

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-500"
        >
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </div>
    </div>
  )
}
