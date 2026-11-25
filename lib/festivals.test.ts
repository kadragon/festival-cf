import { describe, expect, it } from 'vitest'
import type { FestivalItem } from './tourApi'
import { filterWeekendVisit } from './festivals'

const SAT = '20261128'
const SUN = '20261129'

function fest(contentid: string, start: string, end: string): FestivalItem {
  return {
    addr1: '',
    addr2: '',
    areacode: '1',
    contentid,
    contenttypeid: '15',
    eventstartdate: start,
    eventenddate: end,
    firstimage: '',
    firstimage2: '',
    mapx: '',
    mapy: '',
    sigungucode: '',
    tel: '',
    title: contentid,
  }
}

const ids = (items: FestivalItem[]) => items.map((it) => it.contentid)

describe('filterWeekendVisit (weekend Nov 28-29, 2026)', () => {
  it('includes a Thursday-to-Saturday festival', () => {
    expect(ids(filterWeekendVisit([fest('a', '20261126', '20261128')], SAT, SUN))).toEqual(['a'])
  })

  it('excludes a festival that ended Thursday', () => {
    expect(filterWeekendVisit([fest('a', '20261120', '20261126')], SAT, SUN)).toEqual([])
  })

  it('excludes a festival that ended Friday', () => {
    expect(filterWeekendVisit([fest('a', '20261120', '20261127')], SAT, SUN)).toEqual([])
  })

  it('includes festivals that only touch Saturday or only Sunday', () => {
    const items = [
      fest('sat-only', '20261128', '20261128'),
      fest('sun-only', '20261129', '20261129'),
      fest('starts-sun', '20261129', '20261205'),
      fest('long', '20260901', '20261231'),
    ]
    expect(ids(filterWeekendVisit(items, SAT, SUN))).toEqual([
      'sat-only',
      'sun-only',
      'starts-sun',
      'long',
    ])
  })

  it('excludes festivals starting after Sunday', () => {
    expect(filterWeekendVisit([fest('a', '20261130', '20261205')], SAT, SUN)).toEqual([])
  })

  it('dedupes by contentid, keeping the first occurrence', () => {
    const items = [fest('a', '20261128', '20261129'), fest('a', '20261128', '20261129'), fest('b', '20261129', '20261129')]
    expect(ids(filterWeekendVisit(items, SAT, SUN))).toEqual(['a', 'b'])
  })

  it('excludes missing and invalid dates', () => {
    const items = [
      fest('empty-start', '', '20261129'),
      fest('empty-end', '20261128', ''),
      fest('short', '2026112', '20261129'),
      fest('letters', 'abcdefgh', '20261129'),
      fest('no-such-day', '20261128', '20261131'),
      fest('bad-month', '20261328', '20261329'),
      fest('reversed', '20261129', '20261128'),
      fest('ok', '20261128', '20261128'),
    ]
    expect(ids(filterWeekendVisit(items, SAT, SUN))).toEqual(['ok'])
  })

  it('on Sunday the window starts today, so a festival that ended Saturday is excluded', () => {
    const items = [fest('ended-sat', '20261127', '20261128'), fest('ends-sun', '20261127', '20261129')]
    expect(ids(filterWeekendVisit(items, SUN, SUN))).toEqual(['ends-sun'])
  })

  it('does not mutate the input', () => {
    const items = [fest('a', '20261128', '20261128'), fest('a', '20261128', '20261128')]
    filterWeekendVisit(items, SAT, SUN)
    expect(items).toHaveLength(2)
  })
})
