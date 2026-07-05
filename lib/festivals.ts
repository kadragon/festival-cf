import type { FestivalItem } from './tourApi'

export interface FestivalTiers {
  ongoing: FestivalItem[]
  thisWeekend: FestivalItem[]
  upcoming: FestivalItem[]
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
