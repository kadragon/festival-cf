import type { Metadata } from 'next'
import { Black_Han_Sans, Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const blackHanSans = Black_Han_Sans({
  weight: '400',
  variable: '--font-black-han',
  display: 'swap',
  preload: false,
})

const noto = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Festival Korea | 전국 행사 정보',
  description: '전국 행사 및 축제 정보를 한눈에',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${blackHanSans.variable} ${noto.variable} font-sans min-h-screen antialiased`}>
        <header className="sticky top-0 z-40 border-b border-white/5 bg-[#080810]/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <a href="/" className="group flex items-center gap-2.5">
              <span className="text-xl">🏮</span>
              <span className="font-display text-lg font-normal tracking-wide text-white transition-colors group-hover:text-amber-400">
                Festival Korea
              </span>
            </a>
            <span className="hidden text-xs text-[#8888a8] sm:block">전국 행사 정보</span>
          </div>
        </header>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  )
}
