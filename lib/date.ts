export function todayStr(): string {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '')
}

export function daysAgoStr(days: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10).replace(/-/g, '')
}

export function endOfWeekStr(): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + ((7 - d.getUTCDay()) % 7))
  return d.toISOString().slice(0, 10).replace(/-/g, '')
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
