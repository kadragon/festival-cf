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
      numOfRows: 12,
    }),
  ])

  const ongoing = ongoingRes.items.filter(
    (it) => it.eventstartdate < today && it.eventenddate >= today
  )
  const seen = new Set(ongoing.map((it) => it.contentid))
  const upcoming = upcomingRes.items.filter((it) => !seen.has(it.contentid))
  const initialItems = [...ongoing, ...upcoming].slice(0, 12)
  const hasMore = upcomingRes.totalCount > 12

  return (
    <FestivalGrid
      key={area}
      initialItems={initialItems}
      initialHasMore={hasMore}
      area={area}
    />
  )
}

export default async function Home({ searchParams }: Props) {
  const { area = '' } = await searchParams

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          전국 행사 · 축제
        </h1>
        <p className="mt-1 text-sm text-zinc-500">오늘 기준 진행 중이거나 예정된 행사를 만나보세요</p>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm text-zinc-500">지역</span>
        <Suspense>
          <AreaFilter />
        </Suspense>
      </div>

      {/* Grid */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        }
      >
        <FestivalSection area={area} />
      </Suspense>
    </main>
  )
}
