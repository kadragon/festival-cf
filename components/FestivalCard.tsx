import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar } from 'lucide-react'
import { type FestivalItem } from '@/lib/tourApi'
import { formatDate, festivalStatus } from '@/lib/date'
import DateBadge from './DateBadge'

interface Props {
  item: FestivalItem
}

export default function FestivalCard({ item }: Props) {
  const status = festivalStatus(item.eventstartdate, item.eventenddate)
  const location = item.addr1?.split(' ').slice(0, 2).join(' ') ?? ''

  return (
    <Link
      href={`/festivals/${item.contentid}`}
      className="group block overflow-hidden rounded-2xl border border-white/[0.07] bg-[#16162a] transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-[0_8px_32px_rgba(245,158,11,0.12)]"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {item.firstimage ? (
          <>
            <Image
              src={item.firstimage}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-900/40 to-amber-900/20">
            <span className="text-5xl opacity-30">🎪</span>
          </div>
        )}
        <div className="absolute right-2.5 top-2.5">
          <DateBadge status={status} />
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="mb-3 line-clamp-2 text-sm font-semibold leading-snug text-[#f0eee9] transition-colors group-hover:text-amber-400">
          {item.title}
        </h3>
        {location && (
          <p className="mb-1.5 flex items-center gap-1.5 text-xs text-[#8888a8]">
            <MapPin className="h-3 w-3 shrink-0 text-amber-500/60" />
            <span className="truncate">{location}</span>
          </p>
        )}
        <p className="flex items-center gap-1.5 text-xs text-[#8888a8]">
          <Calendar className="h-3 w-3 shrink-0 text-amber-500/60" />
          {formatDate(item.eventstartdate)} — {formatDate(item.eventenddate)}
        </p>
      </div>
    </Link>
  )
}
