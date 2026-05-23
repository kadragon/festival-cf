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
    <div className="flex gap-3 border-b border-white/5 py-3 last:border-0">
      {Icon ? (
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-500/50" />
      ) : (
        <span className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <div className="min-w-0">
        <p className="text-xs text-[#8888a8]">{label}</p>
        <p className="mt-0.5 break-words text-sm text-[#f0eee9]">{value}</p>
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
    <div className="rounded-2xl border border-white/[0.07] bg-[#16162a] p-4 lg:sticky lg:top-24">
      <h2 className="mb-1 text-base font-semibold text-[#f0eee9]">행사 정보</h2>
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
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-sm text-[#8888a8] transition hover:border-amber-500/40 hover:text-amber-400"
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
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-sm font-medium text-black transition hover:bg-amber-400"
          >
            <ExternalLink className="h-4 w-4" />
            공식 홈페이지
          </a>
        )}
      </div>
    </div>
  )
}
