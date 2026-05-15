import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const noto = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Festival Korea | 전국 행사 정보',
  description: '전국 행사 및 축제 정보를 한눈에',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${noto.className} min-h-screen antialiased`}>
        <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center px-4 py-3">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl">🎪</span>
              <span className="text-lg font-bold tracking-tight text-zinc-900">Festival Korea</span>
              <span className="ml-1 hidden text-sm text-zinc-400 sm:inline">전국 행사 정보</span>
            </a>
          </div>
        </header>
        <div className="min-h-screen" style={{ backgroundColor: '#faf9f7' }}>
          {children}
        </div>
      </body>
    </html>
  )
}
