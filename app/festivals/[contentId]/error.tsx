'use client'

import { useEffect } from 'react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function FestivalDetailError({ error, reset }: Props) {
  useEffect(() => {
    console.error('[FestivalDetail]', error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="text-4xl">⚠️</div>
      <div className="text-center">
        <h1 className="mb-2 text-lg font-semibold text-[#f0eee9]">행사 정보를 불러오지 못했습니다</h1>
        <p className="text-sm text-[#8888a8]">잠시 후 다시 시도해 주세요.</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm text-[#f0eee9] transition hover:bg-white/10"
        >
          다시 시도
        </button>
        <a
          href="/"
          className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm text-[#8888a8] transition hover:bg-white/10"
        >
          목록으로
        </a>
      </div>
    </main>
  )
}
