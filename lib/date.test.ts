import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  daysAgoStr,
  endOfWeekStr,
  festivalStatus,
  todayStr,
  weekendRange,
} from './date'

const KST_OFFSET_HOURS = 9

function freezeKst(y: number, m: number, d: number, hh = 0, mm = 0) {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(Date.UTC(y, m - 1, d, hh - KST_OFFSET_HOURS, mm)))
}

afterEach(() => {
  vi.useRealTimers()
})

describe('KST date helpers at Saturday 00:00 KST (2026-11-28)', () => {
  it('uses the KST calendar date even though UTC is still Friday', () => {
    freezeKst(2026, 11, 28, 0, 0)
    expect(new Date().toISOString()).toBe('2026-11-27T15:00:00.000Z')
    expect(todayStr()).toBe('20261128')
  })

  it('daysAgoStr counts back from the KST date', () => {
    freezeKst(2026, 11, 28, 0, 0)
    expect(daysAgoStr(0)).toBe('20261128')
    expect(daysAgoStr(1)).toBe('20261127')
    expect(daysAgoStr(28)).toBe('20261031')
  })

  it('endOfWeekStr is the coming Sunday', () => {
    freezeKst(2026, 11, 28, 0, 0)
    expect(endOfWeekStr()).toBe('20261129')
  })

  it('weekendRange is Nov 28 (Sat) - Nov 29 (Sun)', () => {
    freezeKst(2026, 11, 28, 0, 0)
    expect(weekendRange()).toEqual({ saturday: '20261128', sunday: '20261129' })
  })

  it('festivalStatus judges against the KST date', () => {
    freezeKst(2026, 11, 28, 0, 0)
    expect(festivalStatus('20261128', '20261128')).toBe('ongoing')
    expect(festivalStatus('20261129', '20261130')).toBe('upcoming')
    expect(festivalStatus('20261120', '20261127')).toBe('ended')
  })
})

describe('KST 00:00-09:00 boundary (UTC date lags KST by a day)', () => {
  it('Friday 23:59 KST still belongs to Friday', () => {
    freezeKst(2026, 11, 27, 23, 59)
    expect(todayStr()).toBe('20261127')
    expect(weekendRange()).toEqual({ saturday: '20261128', sunday: '20261129' })
  })

  it('Saturday 08:59 KST (UTC Friday 23:59) is already Saturday', () => {
    freezeKst(2026, 11, 28, 8, 59)
    expect(new Date().toISOString()).toBe('2026-11-27T23:59:00.000Z')
    expect(todayStr()).toBe('20261128')
    expect(weekendRange()).toEqual({ saturday: '20261128', sunday: '20261129' })
  })

  it('Sunday 00:00 KST: Saturday is yesterday, Sunday is today', () => {
    freezeKst(2026, 11, 29, 0, 0)
    expect(todayStr()).toBe('20261129')
    expect(endOfWeekStr()).toBe('20261129')
    expect(weekendRange()).toEqual({ saturday: '20261128', sunday: '20261129' })
  })

  it('Sunday 23:59 KST still shows the same weekend', () => {
    freezeKst(2026, 11, 29, 23, 59)
    expect(todayStr()).toBe('20261129')
    expect(weekendRange()).toEqual({ saturday: '20261128', sunday: '20261129' })
  })

  it('Monday 00:00 KST (UTC Sunday 15:00) rolls over to next weekend', () => {
    freezeKst(2026, 11, 30, 0, 0)
    expect(new Date().toISOString()).toBe('2026-11-29T15:00:00.000Z')
    expect(todayStr()).toBe('20261130')
    expect(endOfWeekStr()).toBe('20261206')
    expect(weekendRange()).toEqual({ saturday: '20261205', sunday: '20261206' })
  })

  it('Monday 08:59 KST keeps the new week', () => {
    freezeKst(2026, 11, 30, 8, 59)
    expect(weekendRange()).toEqual({ saturday: '20261205', sunday: '20261206' })
  })

  it('crosses month and year boundaries', () => {
    freezeKst(2026, 12, 28, 0, 0)
    expect(weekendRange()).toEqual({ saturday: '20270102', sunday: '20270103' })
    expect(daysAgoStr(28)).toBe('20261130')
  })
})
