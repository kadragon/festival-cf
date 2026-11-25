// All "today" logic is pinned to Korea Standard Time (UTC+9, no DST). The
// Workers runtime runs in UTC, so using UTC getters directly would make the
// date lag KST by a day between 00:00 and 09:00 KST.
const KST_OFFSET_MS = 9 * 60 * 60 * 1000

function kstWallClockAsUtc(): Date {
  return new Date(Date.now() + KST_OFFSET_MS)
}

function toYmd(d: Date): string {
  return d.toISOString().slice(0, 10).replace(/-/g, '')
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

export function todayStr(): string {
  return toYmd(kstWallClockAsUtc())
}

export function daysAgoStr(days: number): string {
  return toYmd(addDays(kstWallClockAsUtc(), -days))
}

/** This week's Sunday (KST); today when today is Sunday. */
export function endOfWeekStr(): string {
  const d = kstWallClockAsUtc()
  return toYmd(addDays(d, (7 - d.getUTCDay()) % 7))
}

/** Saturday and Sunday of the current Mon-Sun week in KST, as YYYYMMDD. */
export function weekendRange(): { saturday: string; sunday: string } {
  const d = kstWallClockAsUtc()
  const sunday = addDays(d, (7 - d.getUTCDay()) % 7)
  return { saturday: toYmd(addDays(sunday, -1)), sunday: toYmd(sunday) }
}

/** YYYYMMDD → "MM.DD" */
export function formatMonthDay(yyyymmdd: string): string {
  if (!yyyymmdd || yyyymmdd.length < 8) return ''
  return `${yyyymmdd.slice(4, 6)}.${yyyymmdd.slice(6, 8)}`
}

export function formatDate(yyyymmdd: string): string {
  if (!yyyymmdd || yyyymmdd.length < 8) return ''
  return `${yyyymmdd.slice(0, 4)}.${yyyymmdd.slice(4, 6)}.${yyyymmdd.slice(6, 8)}`
}

export function festivalStatus(start: string, end: string): 'ongoing' | 'upcoming' | 'ended' {
  const today = todayStr()
  if (end < today) return 'ended'
  if (start <= today) return 'ongoing'
  return 'upcoming'
}
