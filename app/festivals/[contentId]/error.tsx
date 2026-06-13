'use client'

import { startTransition, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function FestivalDetailError({ error, reset }: Props) {
  const router = useRouter()

  useEffect(() => {
    console.error('[FestivalDetail]', error)
  }, [error])

  function handleReset() {
    startTransition(() => {
      router.refresh()
      reset()
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="font-display text-5xl text-vermilion">호외</div>
      <div className="text-center">
        <h1 className="mb-2 font-display text-xl text-ink">행사 정보를 불러오지 못했습니다</h1>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
          잠시 후 다시 시도해 주세요
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleReset}
          className="rounded-md border-2 border-ink bg-vermilion px-5 py-2 font-mono text-xs font-bold uppercase tracking-wide text-paper shadow-[3px_3px_0_var(--color-ink)] transition hover:bg-vermilion-deep"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="rounded-md border-2 border-ink/20 px-5 py-2 font-mono text-xs font-bold uppercase tracking-wide text-ink-soft transition hover:border-ink hover:text-ink"
        >
          목록으로
        </Link>
      </div>
    </main>
  )
}
