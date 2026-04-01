import type { Dictionary } from '@/lib/i18n'

interface FooterBottomProps {
  dictionary: Dictionary
}

export function FooterBottom({ dictionary }: FooterBottomProps) {
  return (
    <div className="bg-gray-950 dark:bg-black text-gray-500 text-sm py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 Online Store. {dictionary.footer.rights}.</p>
        <p className="text-xs">Uzbekiston</p>
      </div>
    </div>
  )
}
