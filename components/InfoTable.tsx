import { ExternalLink, Phone, MapPin, Clock, User, Star } from 'lucide-react'
import { type DetailCommon, type DetailIntro } from '@/lib/tourApi'
import { formatDate } from '@/lib/date'

interface Props {
  common: DetailCommon
  intro: DetailIntro | null
}

function Row({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ElementType }) {
  if (!value) return null
  return (
    <div className="flex gap-3 border-b border-line py-3 last:border-0">
      {Icon ? (
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-vermilion/70" />
      ) : (
        <span className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">{label}</p>
        <p className="mt-0.5 break-words font-serif text-sm text-ink">{value}</p>
      </div>
    </div>
  )
}

export default function InfoTable({ common, intro }: Props) {
  const mapUrl =
    common.mapx && common.mapy
      ? `https://map.kakao.com/link/map/${encodeURIComponent(common.title ?? '')},${common.mapy},${common.mapx}`
      : null

  const homepageMatch = common.homepage?.match(/href="([^"]+)"/)
  const homepageUrl =
    homepageMatch?.[1] ?? (common.homepage?.startsWith('http') ? common.homepage : null)

  return (
    <div className="rounded-md border-2 border-ink/20 bg-card p-4 shadow-[4px_5px_0_rgba(33,26,16,0.14)] lg:sticky lg:top-24">
      <h2 className="mb-2 border-b-2 border-ink pb-2 font-display text-lg text-ink">행사 정보</h2>
      <div>
        {intro?.eventstartdate && (
          <Row
            label="기간"
            value={`${formatDate(intro.eventstartdate)} — ${formatDate(intro.eventenddate)}`}
            icon={Clock}
          />
        )}
        {intro?.eventplace && <Row label="행사장" value={intro.eventplace} icon={MapPin} />}
        {common.addr1 && (
          <Row
            label="주소"
            value={[common.addr1, common.addr2].filter(Boolean).join(' ')}
            icon={MapPin}
          />
        )}
        {intro?.usetimefestival && (
          <Row label="이용 요금" value={intro.usetimefestival} icon={Star} />
        )}
        {intro?.playtime && <Row label="공연 시간" value={intro.playtime} icon={Clock} />}
        {intro?.agelimit && <Row label="관람 연령" value={intro.agelimit} icon={User} />}
        {intro?.discountinfofestival && (
          <Row label="요금" value={intro.discountinfofestival} icon={Star} />
        )}
        {intro?.sponsor1 && (
          <Row
            label="주최"
            value={[intro.sponsor1, intro.sponsor1tel].filter(Boolean).join(' ')}
            icon={User}
          />
        )}
        {intro?.sponsor2 && (
          <Row
            label="주관"
            value={[intro.sponsor2, intro.sponsor2tel].filter(Boolean).join(' ')}
            icon={User}
          />
        )}
        {common.tel && <Row label="문의" value={common.tel} icon={Phone} />}
        {intro?.bookingplace && <Row label="예매처" value={intro.bookingplace} />}
        {intro?.program && <Row label="주요 프로그램" value={intro.program} />}
      </div>

      <div className="mt-3 space-y-2">
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-ink/20 py-2.5 font-mono text-xs font-bold uppercase tracking-wide text-ink-soft transition hover:border-ink hover:text-ink"
          >
            <MapPin className="h-4 w-4" />
            지도에서 보기
          </a>
        )}
        {homepageUrl && (
          <a
            href={homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-ink bg-vermilion py-2.5 font-mono text-xs font-bold uppercase tracking-wide text-paper shadow-[3px_3px_0_var(--color-ink)] transition hover:bg-vermilion-deep"
          >
            <ExternalLink className="h-4 w-4" />
            공식 홈페이지
          </a>
        )}
      </div>
    </div>
  )
}
