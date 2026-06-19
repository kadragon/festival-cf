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

    // Two-tier ordering model (deliberate): page 1 is a curated first screen —
    // ongoing first, then upcoming sorted by start-date (soonest first). Page 2+
    // returns raw TourAPI pagination order (arrange:'C', modify-date). Global
    // start-date order across pages is intentionally NOT attempted: TourAPI offers
    // no start-date pagination, so it would require fetching every page per request.
    if (page === 1) {
      // Concurrent: ongoing (started on/before today) + upcoming (start from today)
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
        // Page-1-only start-date sort (curated tier). Page 2+ cannot match this
        // ordering — see the two-tier note above. Undated items sort last via the
        // '99999999' sentinel (> any YYYYMMDD), not first as '' would.
        .sort((a, b) => (a.eventstartdate || '99999999').localeCompare(b.eventstartdate || '99999999'))

      items = [...ongoing, ...upcoming].slice(0, 20)
      hasMore = upcomingRes.totalCount > 20
    } else {
      // Subsequent pages: upcoming only (page 1 covered ongoing). Raw tier —
      // TourAPI paginates by arrange:'C' (modify-date); global start-date order
      // is not available, so these arrive unsorted relative to page 1 by design.
      // These items are returned unfiltered: a festival starting today can surface
      // here AND in page-1 `ongoing`, re-emitting a contentid already sent. Server-
      // side dedup is impossible — the API is stateless and page-1 contentids are
      // unknown on a page>1 request. Accepted tradeoff of stateless pagination; the
      // client dedups via `initialIds`.
      const res = await fetchFestivalList({
        eventStartDate: today,
        areaCode: area || undefined,
        pageNo: page,
        numOfRows: 20,
      })
      items = res.items
      hasMore = res.totalCount > page * 20
    }

    return NextResponse.json({ items, hasMore })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
