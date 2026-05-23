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
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
            current === a.code
              ? 'bg-amber-500 text-black shadow-[0_0_16px_rgba(245,158,11,0.4)]'
              : 'border border-white/10 bg-white/5 text-[#8888a8] hover:border-white/20 hover:bg-white/10 hover:text-white'
          }`}
        >
          {a.name}
        </button>
      ))}
    </div>
  )
}
