import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar } from 'lucide-react'
import { type FestivalItem } from '@/lib/tourApi'
import { formatDate, festivalStatus } from '@/lib/date'
import DateBadge from './DateBadge'

interface Props {
  item: FestivalItem
}

const accentByStatus = {
  ongoing: 'bg-vermilion',
  upcoming: 'bg-cheong',
  ended: 'bg-ink-soft',
}

export default function FestivalCard({ item }: Props) {
  const status = festivalStatus(item.eventstartdate, item.eventenddate)
  const location = item.addr1?.split(' ').slice(0, 2).join(' ') ?? ''

  return (
    <Link
      href={`/festivals/${item.contentid}`}
      className="group relative block rounded-md border-2 border-ink/20 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-vermilion hover:shadow-[5px_6px_0_rgba(33,26,16,0.22)]"
    >
      {/* Ticket — image stub */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-[4px]">
        {item.firstimage ? (
          <>
            <Image
              src={item.firstimage}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-paper-2">
            <span className="font-display text-3xl text-ink/15">축제</span>
          </div>
        )}
        <div className="absolute right-2.5 top-2.5">
          <DateBadge status={status} />
        </div>
        {/* status accent rail */}
        <span className={`absolute left-0 top-0 h-full w-1.5 ${accentByStatus[status]}`} />
      </div>

      {/* Perforation */}
      <div className="relative h-0">
        <div className="absolute inset-x-3 top-0 border-t-2 border-dashed border-line" />
        <span className="absolute -left-[9px] top-0 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-ink/20 bg-paper" />
        <span className="absolute -right-[9px] top-0 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-ink/20 bg-paper" />
      </div>

      {/* Info stub */}
      <div className="p-4 pt-5">
        <h3 className="mb-3 line-clamp-2 font-serif text-[15px] font-bold leading-snug text-ink transition-colors group-hover:text-vermilion">
          {item.title}
        </h3>
        {location && (
          <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] text-ink-soft">
            <MapPin className="h-3 w-3 shrink-0 text-vermilion/70" />
            <span className="truncate">{location}</span>
          </p>
        )}
        <p className="flex items-center gap-1.5 font-mono text-[11px] text-ink-soft">
          <Calendar className="h-3 w-3 shrink-0 text-vermilion/70" />
          {formatDate(item.eventstartdate)} — {formatDate(item.eventenddate)}
        </p>
      </div>
    </Link>
  )
}
