import { Suspense } from 'react'
import { fetchFestivalList } from '@/lib/tourApi'
import { todayStr, daysAgoStr } from '@/lib/date'
import FestivalGrid from '@/components/FestivalGrid'
import AreaFilter from '@/components/AreaFilter'
import CardSkeleton from '@/components/CardSkeleton'

interface Props {
  searchParams: Promise<{ area?: string }>
}

async function FestivalSection({ area }: { area: string }) {
  const today = todayStr()

  const [ongoingRes, upcomingRes] = await Promise.all([
    fetchFestivalList({
      eventStartDate: daysAgoStr(180),
      areaCode: area || undefined,
      pageNo: 1,
      numOfRows: 50,
    }),
    fetchFestivalList({
      eventStartDate: today,
      areaCode: area || undefined,
      pageNo: 1,
      numOfRows: 20,
    }),
  ])

  const ongoing = ongoingRes.items.filter(
    (it) => it.eventstartdate <= today && it.eventenddate >= today
  )
  const seen = new Set(ongoing.map((it) => it.contentid))
  const upcoming = upcomingRes.items
    .filter((it) => !seen.has(it.contentid))
    .sort((a, b) => a.eventstartdate.localeCompare(b.eventstartdate))

  return (
    <FestivalGrid
      key={area}
      ongoingItems={ongoing}
      upcomingItems={upcoming}
      initialHasMore={upcomingRes.totalCount > 20}
      area={area}
    />
  )
}

export default async function Home({ searchParams }: Props) {
  const { area = '' } = await searchParams

  return (
    <main>
      {/* Masthead */}
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-10 md:pt-14">
        <div className="reveal flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-soft">
          <span>전국 축제 · 행사 속보</span>
          <span className="hidden sm:inline">제 1 호 · 매일 발행</span>
        </div>
        <div className="rule-double reveal mt-2.5 pt-6" style={{ animationDelay: '60ms' }}>
          <h1 className="font-display text-6xl leading-[0.92] tracking-tight text-ink sm:text-7xl lg:text-[8.5rem]">
            지금, 어디서
            <br />
            <span className="text-vermilion">무슨</span> 축제?
          </h1>
        </div>
        <div
          className="reveal mt-6 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-end sm:justify-between"
          style={{ animationDelay: '140ms' }}
        >
          <p className="max-w-md font-serif text-base leading-relaxed text-ink-soft">
            오늘 기준 전국에서 열리고 있거나 곧 막을 올리는 행사를
            <br className="hidden sm:block" /> 한 면에 펼쳐 모았습니다.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
            TourAPI v2 · 한국관광공사
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-[var(--header-h)] z-30 border-y-[1.5px] border-ink bg-paper/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <Suspense>
            <AreaFilter />
          </Suspense>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <FestivalSection area={area} />
        </Suspense>
      </div>
    </main>
  )
}
