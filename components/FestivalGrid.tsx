'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { type FestivalItem } from '@/lib/tourApi'
import FestivalCard from './FestivalCard'
import CardSkeleton from './CardSkeleton'

interface Props {
  ongoingItems: FestivalItem[]
  upcomingItems: FestivalItem[]
  initialHasMore: boolean
  area: string
}

const GRID = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

export default function FestivalGrid({ ongoingItems, upcomingItems, initialHasMore, area }: Props) {
  const [extraItems, setExtraItems] = useState<FestivalItem[]>([])
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const pageRef = useRef(2)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const initialIds = useRef(
    new Set([...ongoingItems, ...upcomingItems].map((it) => it.contentid))
  )

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(pageRef.current) })
      if (area) params.set('area', area)
      const res = await fetch(`/api/festivals?${params}`)
      const data = await res.json()
      if (data.items?.length) {
        setExtraItems((prev) => {
          const seen = new Set([
            ...prev.map((it) => it.contentid),
            ...initialIds.current,
          ])
          return [...prev, ...data.items.filter((it: FestivalItem) => !seen.has(it.contentid))]
        })
        pageRef.current++
      }
      setHasMore(data.hasMore ?? false)
    } catch {
      // silent — user can scroll again to retry
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, area])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { rootMargin: '200px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  if (ongoingItems.length === 0 && upcomingItems.length === 0 && !loading) {
    return (
      <div className="py-24 text-center">
        <p className="mb-4 text-5xl opacity-20">🎪</p>
        <p className="text-sm text-[#8888a8]">해당 지역 행사 정보가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Ongoing */}
      {ongoingItems.length > 0 && (
        <section>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              지금 진행중
            </h2>
            <span className="text-xs text-[#8888a8]">{ongoingItems.length}개</span>
            <div className="ml-auto h-px flex-1 bg-emerald-500/10" />
          </div>
          <div className={GRID}>
            {ongoingItems.map((item) => (
              <FestivalCard key={item.contentid} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcomingItems.length > 0 && (
        <section>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
              다가오는 축제
            </h2>
            <span className="text-xs text-[#8888a8]">{upcomingItems.length}개</span>
            <div className="ml-auto h-px flex-1 bg-blue-500/10" />
          </div>
          <div className={GRID}>
            {upcomingItems.map((item) => (
              <FestivalCard key={item.contentid} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Extra loaded */}
      {extraItems.length > 0 && (
        <section>
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-xs text-[#8888a8]">더 많은 축제</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className={GRID}>
            {extraItems.map((item) => (
              <FestivalCard key={item.contentid} item={item} />
            ))}
          </div>
        </section>
      )}

      {loading && (
        <div className={GRID}>
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}
      <div ref={sentinelRef} className="h-4" />
    </div>
  )
}
