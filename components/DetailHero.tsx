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
    <div className="relative h-64 w-full overflow-hidden md:h-80 lg:h-96">
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
        <div className="h-full w-full bg-gradient-to-br from-violet-900/50 via-[#16162a] to-amber-900/30" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      {/* Back button */}
      <Link
        href="/"
        className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-sm text-white/90 backdrop-blur-sm transition hover:bg-black/60"
      >
        <ArrowLeft className="h-4 w-4" />
        목록
      </Link>

      {/* Title area */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {status && <DateBadge status={status} className="mb-2.5" />}
        <h1 className="mb-2 text-2xl font-bold leading-tight text-white md:text-3xl">
          {common.title}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-white/70">
          {common.addr1 && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-amber-400/70" />
              {common.addr1}
            </span>
          )}
          {start && end && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-amber-400/70" />
              {formatDate(start)} — {formatDate(end)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
