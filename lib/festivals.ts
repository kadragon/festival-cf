import type { FestivalItem } from './tourApi'

export interface FestivalTiers {
  ongoing: FestivalItem[]
  thisWeekend: FestivalItem[]
  upcoming: FestivalItem[]
}

function isValidYmd(s: string): boolean {
  if (!/^\d{8}$/.test(s)) return false
  const y = Number(s.slice(0, 4))
  const m = Number(s.slice(4, 6))
  const d = Number(s.slice(6, 8))
  const dt = new Date(Date.UTC(y, m - 1, d))
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d
}

/**
 * Festivals whose [eventstartdate, eventenddate] overlaps the given Saturday or
 * Sunday (YYYYMMDD). Items with a missing/invalid date or start > end are
 * skipped; duplicates are dropped by contentid (first wins). Pure filter over
 * already-fetched items — makes no API calls.
 */
export function filterWeekendVisit(
  items: FestivalItem[],
  saturday: string,
  sunday: string
): FestivalItem[] {
  const seen = new Set<string>()
  const result: FestivalItem[] = []
  for (const it of items) {
    const { eventstartdate: start, eventenddate: end } = it
    if (!isValidYmd(start) || !isValidYmd(end) || start > end) continue
    if (start > sunday || end < saturday) continue
    if (seen.has(it.contentid)) continue
    seen.add(it.contentid)
    result.push(it)
  }
  return result
}

/**
 * Splits fetched festival results into three display tiers: ongoing (already
 * started, not yet ended), this-weekend (starts on/before this week's Sunday),
 * and upcoming (starts after this week's Sunday). `upcomingCandidates` items
 * already present in `ongoingCandidates` are deduped by contentid.
 */
export function splitFestivalTiers(
  ongoingCandidates: FestivalItem[],
  upcomingCandidates: FestivalItem[],
  today: string,
  weekend: string
): FestivalTiers {
  const ongoing = ongoingCandidates.filter(
    (it) => it.eventstartdate <= today && it.eventenddate >= today
  )
  const seen = new Set(ongoing.map((it) => it.contentid))
  const rest = upcomingCandidates
    .filter((it) => !seen.has(it.contentid))
    // Undated items sort last via the '99999999' sentinel (> any YYYYMMDD).
    .sort((a, b) => (a.eventstartdate || '99999999').localeCompare(b.eventstartdate || '99999999'))
  const thisWeekend = rest.filter((it) => (it.eventstartdate || '99999999') <= weekend)
  const upcoming = rest.filter((it) => (it.eventstartdate || '99999999') > weekend)

  return { ongoing, thisWeekend, upcoming }
}
