'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { AREA_CODES } from '@/lib/areaCodes'

export default function AreaFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get('area') ?? ''

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams()
    if (e.target.value) params.set('area', e.target.value)
    router.push(params.size ? `/?${params}` : '/')
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
    >
      {AREA_CODES.map((a) => (
        <option key={a.code} value={a.code}>
          {a.name}
        </option>
      ))}
    </select>
  )
}
