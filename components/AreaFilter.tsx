'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { AREA_CODES } from '@/lib/areaCodes'

export default function AreaFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get('area') ?? ''

  function select(code: string) {
    const params = new URLSearchParams()
    if (code) params.set('area', code)
    router.push(params.size ? `/?${params}` : '/')
  }

  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-0.5">
      {AREA_CODES.map((a) => (
        <button
          key={a.code}
          onClick={() => select(a.code)}
          className={`shrink-0 border-2 px-3.5 py-1 font-mono text-[12px] font-bold uppercase tracking-wide transition-all duration-200 ${
            current === a.code
              ? 'border-ink bg-ink text-paper shadow-[2px_2px_0_var(--color-vermilion)]'
              : 'border-ink/20 bg-card text-ink-soft hover:border-ink hover:text-ink'
          }`}
        >
          {a.name}
        </button>
      ))}
    </div>
  )
}
