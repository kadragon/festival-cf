'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { type FestivalItem } from '@/lib/tourApi'
import FestivalCard from './FestivalCard'
import CardSkeleton from './CardSkeleton'

interface Props {
  initialItems: FestivalItem[]
  initialHasMore: boolean
  area: string
}

export default function FestivalGrid({ initialItems, initialHasMore, area }: Props) {
  const [items, setItems] = useState<FestivalItem[]>(initialItems)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const pageRef = useRef(2) // next backend page to fetch
  const sentinelRef = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(pageRef.current) })
      if (area) params.set('area', area)
      const res = await fetch(`/api/festivals?${params}`)
      const data = await res.json()
      if (data.items?.length) {
        setItems((prev) => {
          const seen = new Set(prev.map((it) => it.contentid))
          return [...prev, ...data.items.filter((it: FestivalItem) => !seen.has(it.contentid))]
        })
        pageRef.current++
      }
      setHasMore(data.hasMore ?? false)
    } catch {
      // silently fail — user can scroll again to retry
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, area])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() },
      { rootMargin: '200px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  if (items.length === 0 && !loading) {
    return (
      <div className="py-24 text-center text-zinc-400">
        <p className="text-5xl mb-4">🎪</p>
        <p className="text-sm">해당 지역 행사 정보가 없습니다</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <FestivalCard key={item.contentid} item={item} />
        ))}
        {loading && Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
      <div ref={sentinelRef} className="h-4" />
    </>
  )
}
