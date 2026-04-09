interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | '...')[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i)
    }

    pages.push(0)

    const start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages - 2, currentPage + 2)

    if (start > 1) pages.push('...')

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages - 2) pages.push('...')

    pages.push(totalPages - 1)

    return pages
  }

  const pages = getPageNumbers()

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="15,18 9,12 15,6" />
        </svg>
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex items-center justify-center w-9 h-9 text-gray-500 dark:text-gray-400"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-blue-600 text-white border border-blue-600'
                : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {(page as number) + 1}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="9,18 15,12 9,6" />
        </svg>
      </button>
    </nav>
  )
}
