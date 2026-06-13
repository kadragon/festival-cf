import type { Metadata } from 'next'
import { Black_Han_Sans, Noto_Serif_KR, Space_Mono } from 'next/font/google'
import './globals.css'

const blackHanSans = Black_Han_Sans({
  weight: '400',
  variable: '--font-black-han',
  display: 'swap',
  preload: false,
})

const notoSerif = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-serif',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '축제소식 — 전국 행사 가제트',
  description: '오늘 전국에서 열리는 축제와 행사를 신문처럼 펼쳐 봅니다',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Asia/Seoul calendar day — UTC-based date would show yesterday between
  // 00:00–08:59 KST. en-CA yields YYYY-MM-DD; reformat to the gazette's dot style.
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' })
    .format(new Date())
    .replace(/-/g, '.')

  return (
    <html lang="ko">
      <body
        className={`${blackHanSans.variable} ${notoSerif.variable} ${spaceMono.variable} min-h-screen antialiased`}
      >
        <header className="sticky top-0 z-40 border-b-[3px] border-double border-ink bg-paper/95 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between gap-4 py-2.5">
              <a href="/" className="group flex items-baseline gap-2.5">
                <span className="font-display text-2xl leading-none tracking-tight text-ink transition-colors group-hover:text-vermilion">
                  축제소식
                </span>
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft sm:inline">
                  Festival&nbsp;Gazette
                </span>
              </a>
              <span className="font-mono text-[11px] tracking-tight text-ink-soft">
                {today}
              </span>
            </div>
          </div>
        </header>
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  )
}
