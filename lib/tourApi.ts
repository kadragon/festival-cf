const BASE = 'https://apis.data.go.kr/B551011/KorService2'

function getKey(): string {
  const key = process.env.DATA_GO_KR_APIKEY
  if (!key) throw new Error('DATA_GO_KR_APIKEY not configured')
  return key
}

// serviceKey is already URL-encoded in .env — must NOT re-encode
function buildUrl(path: string, params: Record<string, string | number>): string {
  const qs = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&')
  return `${BASE}${path}?serviceKey=${getKey()}&_type=json&MobileOS=ETC&MobileApp=festival-app&${qs}`
}

function ensureArray<T>(val: T | T[] | '' | null | undefined): T[] {
  if (!val || val === '') return []
  return Array.isArray(val) ? val : [val]
}

// ─── Types ────────────────────────────────────────────────────────────────

export interface FestivalItem {
  addr1: string
  addr2: string
  areacode: string
  contentid: string
  contenttypeid: string
  eventstartdate: string
  eventenddate: string
  firstimage: string
  firstimage2: string
  mapx: string
  mapy: string
  sigungucode: string
  tel: string
  title: string
}

export interface DetailCommon {
  addr1: string
  addr2: string
  overview: string
  homepage: string
  tel: string
  telname: string
  firstimage: string
  firstimage2: string
  mapx: string
  mapy: string
  title: string
  contenttypeid: string
}

export interface DetailIntro {
  agelimit: string
  bookingplace: string
  discountinfofestival: string
  eventenddate: string
  eventstartdate: string
  eventplace: string
  festivalgrade: string
  placeinfo: string
  playtime: string
  program: string
  spendtimefestival: string
  sponsor1: string
  sponsor1tel: string
  sponsor2: string
  sponsor2tel: string
  subevent: string
  usetimefestival: string
}

export interface DetailImage {
  imgname: string
  originimgurl: string
  serialnum: string
  smallimageurl: string
}

// ─── API Functions ─────────────────────────────────────────────────────────

export async function fetchFestivalList(params: {
  eventStartDate: string
  areaCode?: string
  pageNo?: number
  numOfRows?: number
}): Promise<{ items: FestivalItem[]; totalCount: number }> {
  const qp: Record<string, string | number> = {
    arrange: 'C',
    eventStartDate: params.eventStartDate,
    numOfRows: params.numOfRows ?? 30,
    pageNo: params.pageNo ?? 1,
  }
  if (params.areaCode) qp.lDongRegnCd = params.areaCode

  const url = buildUrl('/searchFestival2', qp)
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()

  const header = json.response?.header
  if (header?.resultCode !== '0000') throw new Error(header?.resultMsg ?? 'API error')

  const body = json.response.body
  return {
    items: ensureArray<FestivalItem>(body?.items?.item),
    totalCount: Number(body?.totalCount ?? 0),
  }
}

export async function fetchDetailCommon(contentId: string): Promise<DetailCommon | null> {
  const url = buildUrl('/detailCommon2', { contentId })
  const res = await fetch(url, { next: { revalidate: 300 } })
  const json = await res.json()
  const items = ensureArray(json.response?.body?.items?.item)
  return (items[0] as DetailCommon) ?? null
}

export async function fetchDetailIntro(contentId: string): Promise<DetailIntro | null> {
  const url = buildUrl('/detailIntro2', { contentId, contentTypeId: '15' })
  const res = await fetch(url, { next: { revalidate: 300 } })
  const json = await res.json()
  const items = ensureArray(json.response?.body?.items?.item)
  return (items[0] as DetailIntro) ?? null
}

export async function fetchDetailImages(contentId: string): Promise<DetailImage[]> {
  const url = buildUrl('/detailImage2', { contentId, imageYN: 'Y', numOfRows: 20, pageNo: 1 })
  const res = await fetch(url, { next: { revalidate: 300 } })
  const json = await res.json()
  return ensureArray<DetailImage>(json.response?.body?.items?.item)
}
