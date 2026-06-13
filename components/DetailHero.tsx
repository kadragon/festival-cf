import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/date'
import DateBadge from './DateBadge'
import { type DetailCommon, type DetailIntro } from '@/lib/tourApi'
import { festivalStatus } from '@/lib/date'

interface Props {
  common: DetailCommon
  intro: DetailIntro | null
}

export default function DetailHero({ common, intro }: Props) {
  const start = intro?.eventstartdate ?? ''
  const end = intro?.eventenddate ?? ''
  const status = start && end ? festivalStatus(start, end) : null

  return (
    <div className="relative h-72 w-full overflow-hidden border-b-[3px] border-double border-ink md:h-80 lg:h-[26rem]">
      {common.firstimage ? (
        <Image
          src={common.firstimage}
          alt={common.title ?? ''}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-paper-2">
          <span className="font-display text-6xl text-ink/15">축제</span>
        </div>
      )}

      {/* Ink wash overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />

      {/* Back button */}
      <Link
        href="/"
        className="absolute left-4 top-4 flex items-center gap-1.5 border-2 border-paper/70 bg-ink/40 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wide text-paper backdrop-blur-sm transition hover:bg-ink/70"
      >
        <ArrowLeft className="h-4 w-4" />
        목록
      </Link>

      {/* Title area */}
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl p-6">
        {status && <DateBadge status={status} className="mb-3" />}
        <h1 className="mb-3 font-display text-3xl leading-[1.02] tracking-tight text-paper md:text-5xl lg:text-6xl">
          {common.title}
        </h1>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[13px] text-paper/80">
          {common.addr1 && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-marigold" />
              {common.addr1}
            </span>
          )}
          {start && end && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-marigold" />
              {formatDate(start)} — {formatDate(end)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
