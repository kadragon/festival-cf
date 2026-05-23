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
    (it) => it.eventstartdate < today && it.eventenddate >= today
  )
  const seen = new Set(ongoing.map((it) => it.contentid))
  const upcoming = upcomingRes.items.filter((it) => !seen.has(it.contentid))

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
      {/* Hero */}
      <div className="relative overflow-hidden px-4 pb-12 pt-16 md:pb-16 md:pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-[15%] h-72 w-72 rounded-full bg-violet-600/8 blur-3xl" />
          <div className="absolute right-[12%] top-[10%] h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-[35%] h-40 w-96 rounded-full bg-rose-600/6 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-amber-500/60">
            전국 행사 · 축제
          </p>
          <h1 className="font-display mb-4 text-6xl font-normal leading-none text-white sm:text-7xl lg:text-8xl">
            지금 어디서<br />무슨 축제?
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-[#8888a8]">
            오늘 기준 진행 중이거나 예정된 전국 행사를 한눈에 확인하세요
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-[53px] z-30 border-b border-white/5 bg-[#080810]/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto max-w-7xl">
          <Suspense>
            <AreaFilter />
          </Suspense>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
