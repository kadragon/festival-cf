import { NextRequest, NextResponse } from 'next/server'
import { fetchFestivalList, type FestivalItem } from '@/lib/tourApi'
import { todayStr, daysAgoStr } from '@/lib/date'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const area = searchParams.get('area') ?? ''
  const today = todayStr()

  try {
    let items: FestivalItem[]
    let hasMore: boolean

    if (page === 1) {
      // Concurrent: ongoing (started before today) + upcoming (start from today)
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

      items = [...ongoing, ...upcoming].slice(0, 12)
      hasMore = upcomingRes.totalCount > 12
    } else {
      // Subsequent pages: upcoming only (page 1 covered ongoing)
      const res = await fetchFestivalList({
        eventStartDate: today,
        areaCode: area || undefined,
        pageNo: page,
        numOfRows: 12,
      })
      items = res.items
      hasMore = res.totalCount > page * 12
    }

    return NextResponse.json({ items, hasMore })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
