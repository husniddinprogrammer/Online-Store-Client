import Link from '@/router/navigation'
import Image from '@/components/ui/AppImage'
import { img } from '@/utils/img'
import type { CategoryResponse } from '@/services/api/types'

interface CategoryCardProps {
  category: CategoryResponse
  lang: string
}

export function CategoryCard({ category, lang }: CategoryCardProps) {
  return (
    <Link
      href={`/${lang}/category/${category.id}`}
      className="flex flex-col items-center gap-2 group"
    >
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:border-blue-300 dark:group-hover:border-blue-500 transition-colors shadow-sm">
        {category.imageLink ? (
          <Image
            src={img(category.imageLink) ?? ''}
            alt={category.name}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        ) : (
          <svg
            className="w-8 h-8 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
        )}
      </div>
      <span className="text-xs text-center text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-medium line-clamp-2 max-w-[80px]">
        {category.name}
      </span>
    </Link>
  )
}
