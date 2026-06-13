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

const GRID = 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

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
      const data = (await res.json()) as { items?: FestivalItem[]; hasMore?: boolean }
      const newItems = data.items ?? []
      if (newItems.length) {
        setExtraItems((prev) => {
          const seen = new Set([
            ...prev.map((it) => it.contentid),
            ...initialIds.current,
          ])
          return [...prev, ...newItems.filter((it) => !seen.has(it.contentid))]
        })
      }
      pageRef.current++
      setHasMore(data.hasMore ?? false)
    } catch (err) {
      console.warn('[FestivalGrid] loadMore failed:', err)
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
      <div className="rule-double border-x-0 border-b-0 py-24 text-center">
        <p className="mb-3 font-display text-4xl text-ink/15">휴간</p>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
          해당 지역 행사 소식이 없습니다
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-14">
      {/* Ongoing */}
      {ongoingItems.length > 0 && (
        <section>
          <div className="mb-6 flex items-baseline gap-3 border-b-2 border-ink pb-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-vermilion" />
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-vermilion">
              지금 진행중
            </h2>
            <span className="font-mono text-xs text-ink-soft">{ongoingItems.length}건</span>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              Now Open
            </span>
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
          <div className="mb-6 flex items-baseline gap-3 border-b-2 border-ink pb-2">
            <span className="h-2 w-2 rounded-full bg-cheong" />
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-cheong">
              다가오는 축제
            </h2>
            <span className="font-mono text-xs text-ink-soft">{upcomingItems.length}건</span>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              Coming Soon
            </span>
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
          <div className="mb-6 flex items-baseline gap-3 border-b border-line pb-2">
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
              더 많은 소식
            </h2>
            <span className="font-mono text-xs text-ink-soft">{extraItems.length}건</span>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              More
            </span>
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
