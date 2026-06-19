import { getCloudflareContext } from '@opennextjs/cloudflare'

const DIRECT_BASE = 'https://apis.data.go.kr/B551011/KorService2'

// Single source of truth for CF env keys used by this module.
const CF_ENV_KEYS = ['DATA_GO_KR_APIKEY', 'OPEN_DATA_API_PROXY_URL', 'OPEN_DATA_X_API_KEY'] as const

// .dev.vars values are exposed via getCloudflareContext().env during `next dev`,
// and via process.env on the deployed Worker. Read both so the same code works
// in dev and prod. async: true is required from RSC/SSG paths in dev.
// CF env wins over process.env, allowing .dev.vars to override host env in dev.
let cachedEnv: Record<string, string | undefined> | null = null
async function readEnv(): Promise<Record<string, string | undefined>> {
  if (cachedEnv) return cachedEnv
  const fromProcess = process.env as Record<string, string | undefined>
  try {
    const { env } = await getCloudflareContext({ async: true })
    const envObj = (env || {}) as unknown as Record<string, unknown>
    const cfVars: Record<string, string | undefined> = {}
    for (const key of CF_ENV_KEYS) {
      const val = envObj[key]
      if (typeof val === 'string') cfVars[key] = val
    }
    cachedEnv = { ...fromProcess, ...cfVars }
  } catch (err) {
    // Expected when not in Workers runtime (e.g. pure Node dev or unit tests).
    // Only log genuinely unexpected errors so SDK bugs don't disappear silently.
    if (!(err instanceof Error) || !err.message.toLowerCase().includes('cloudflare')) {
      console.warn('[tourApi] getCloudflareContext failed, falling back to process.env:', err)
    }
    cachedEnv = fromProcess
  }
  return cachedEnv
}

async function buildRequest(
  path: string,
  params: Record<string, string | number>,
): Promise<{ url: string; init: RequestInit }> {
  const env = await readEnv()
  const commonQs = Object.entries({
    _type: 'json',
    MobileOS: 'ETC',
    MobileApp: 'festival-app',
    ...params,
  })
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&')

  const proxyUrl = env.OPEN_DATA_API_PROXY_URL
  const proxyKey = env.OPEN_DATA_X_API_KEY
  if (Boolean(proxyUrl) !== Boolean(proxyKey)) {
    throw new Error('Both OPEN_DATA_API_PROXY_URL and OPEN_DATA_X_API_KEY must be set together')
  }
  if (proxyUrl && proxyKey) {
    const base = `${proxyUrl.replace(/\/$/, '')}/KorService2`
    return {
      url: `${base}${path}?${commonQs}`,
      init: { headers: { 'x-api-key': proxyKey } },
    }
  }

  const directKey = env.DATA_GO_KR_APIKEY
  if (!directKey) throw new Error('DATA_GO_KR_APIKEY not configured')
  // serviceKey is already URL-encoded in .env — must NOT re-encode
  return {
    url: `${DIRECT_BASE}${path}?serviceKey=${directKey}&${commonQs}`,
    init: {},
  }
}

// Trust-boundary cast: TourAPI returns `items.item` as a single object, an array,
// or '' (empty). The `as T[]` deliberately trusts the external JSON's shape —
// callers assert element types via the ApiEnvelope / FestivalItem interfaces. A
// per-element runtime predicate is intentionally omitted (disproportionate for an
// external-JSON boundary; matches the project's doc-resolution house style).
function ensureArray<T>(val: unknown): T[] {
  if (!val || val === '') return []
  return (Array.isArray(val) ? val : [val]) as T[]
}

// TourAPI v2 JSON envelope. fetch's Response.json() is typed `unknown`, so each
// call site asserts this shape before reading response.header / response.body.
interface ApiEnvelope {
  response?: {
    header?: { resultCode?: string; resultMsg?: string }
    body?: { totalCount?: number | string; items?: { item?: unknown } }
  }
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

  const { url, init } = await buildRequest('/searchFestival2', qp)
  const res = await fetch(url, { ...init, next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = (await res.json()) as ApiEnvelope

  const response = json.response
  if (!response || response.header?.resultCode !== '0000') {
    throw new Error(response?.header?.resultMsg ?? 'API error')
  }

  const body = response.body
  return {
    items: ensureArray<FestivalItem>(body?.items?.item),
    totalCount: Number(body?.totalCount ?? 0),
  }
}

export async function fetchDetailCommon(contentId: string): Promise<DetailCommon | null> {
  const { url, init } = await buildRequest('/detailCommon2', { contentId })
  const res = await fetch(url, { ...init, next: { revalidate: 300 } })
  if (!res.ok) throw new Error(`detailCommon2 HTTP ${res.status} (contentId=${contentId})`)
  const json = (await res.json()) as ApiEnvelope
  if (json.response?.header?.resultCode !== '0000')
    throw new Error(`${json.response?.header?.resultMsg ?? 'API error'} (contentId=${contentId})`)
  const items = ensureArray<DetailCommon>(json.response?.body?.items?.item)
  return items[0] ?? null
}

export async function fetchDetailIntro(contentId: string): Promise<DetailIntro | null> {
  const { url, init } = await buildRequest('/detailIntro2', { contentId, contentTypeId: '15' })
  const res = await fetch(url, { ...init, next: { revalidate: 300 } })
  if (!res.ok) throw new Error(`detailIntro2 HTTP ${res.status} (contentId=${contentId})`)
  const json = (await res.json()) as ApiEnvelope
  if (json.response?.header?.resultCode !== '0000')
    throw new Error(`${json.response?.header?.resultMsg ?? 'API error'} (contentId=${contentId})`)
  const items = ensureArray<DetailIntro>(json.response?.body?.items?.item)
  return items[0] ?? null
}

export async function fetchDetailImages(contentId: string): Promise<DetailImage[]> {
  const { url, init } = await buildRequest('/detailImage2', { contentId, imageYN: 'Y', numOfRows: 20, pageNo: 1 })
  const res = await fetch(url, { ...init, next: { revalidate: 300 } })
  if (!res.ok) throw new Error(`detailImage2 HTTP ${res.status} (contentId=${contentId})`)
  const json = (await res.json()) as ApiEnvelope
  if (json.response?.header?.resultCode !== '0000')
    throw new Error(`${json.response?.header?.resultMsg ?? 'API error'} (contentId=${contentId})`)
  return ensureArray<DetailImage>(json.response?.body?.items?.item)
}
