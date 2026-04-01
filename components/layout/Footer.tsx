import Link from 'next/link'
import type { Dictionary } from '@/lib/i18n'

interface FooterProps {
  lang: string
  dictionary: Dictionary
}

function TelegramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.24c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.24 1.84 1.24 1.08 1.84 2.83 1.31 3.52 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.58c1.02 0 2.05.14 3.01.41 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.92 1.24 3.23 0 4.62-2.8 5.64-5.48 5.94.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46 2.48 2.48 0 0 0 4.98 3.5ZM3 9h4v12H3V9Zm7 0h3.83v1.64h.06c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.14V21h-4v-5.48c0-1.3-.02-2.98-1.82-2.98-1.82 0-2.1 1.42-2.1 2.88V21h-4V9Z" />
    </svg>
  )
}

export function Footer({ lang, dictionary }: FooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-slate-800/60">
          {/* Left: Logo + contact */}
          <div className="flex flex-col gap-4">
            <Link href={`/${lang}`} className="text-2xl font-bold gradient-text w-fit">
              Online Store
            </Link>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.1a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 15z" />
                </svg>
                <a href="tel:+998915604085" className="hover:text-blue-400 transition-colors">
                  {dictionary.footer.support}: +998 91 560 40 85
                </a>
              </div>
              <div className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{dictionary.footer.address}: Toshkent, Uzbekiston</span>
              </div>
            </div>
          </div>

          {/* Center: Nav links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold text-xs uppercase tracking-widest">
              {dictionary.footer.pages}
            </h3>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href={`/${lang}`} className="hover:text-blue-400 hover:translate-x-1 transition-all duration-150 w-fit">
                {dictionary.footer.home}
              </Link>
              <Link href={`/${lang}/category/all`} className="hover:text-blue-400 hover:translate-x-1 transition-all duration-150 w-fit">
                {dictionary.footer.categories}
              </Link>
              <Link href={`/${lang}/cart`} className="hover:text-blue-400 hover:translate-x-1 transition-all duration-150 w-fit">
                {dictionary.footer.cart}
              </Link>
              <Link href={`/${lang}/favorites`} className="hover:text-blue-400 hover:translate-x-1 transition-all duration-150 w-fit">
                {dictionary.footer.favorites}
              </Link>
            </div>
          </div>

          {/* Right: Social */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold text-xs uppercase tracking-widest">
              {dictionary.footer.followUs}
            </h3>
            <div className="flex items-center gap-2.5">
              <a
                href="https://t.me/Husniddin301515"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-600 hover:text-white hover:scale-110 flex items-center justify-center transition-all duration-200 shadow-sm"
                aria-label="Telegram"
              >
                <TelegramIcon />
              </a>
              <a
                href="https://www.instagram.com/husniddin_15_15_/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 hover:text-white hover:scale-110 flex items-center justify-center transition-all duration-200 shadow-sm"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://github.com/husniddinprogrammer"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-600 hover:text-white hover:scale-110 flex items-center justify-center transition-all duration-200 shadow-sm"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
              <a
                href="https://www.linkedin.com/in/husniddin-mahmudov-25225b220/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-700 hover:text-white hover:scale-110 flex items-center justify-center transition-all duration-200 shadow-sm"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
