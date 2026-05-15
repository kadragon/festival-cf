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
  const location = [item.addr1?.split(' ').slice(0, 2).join(' ')].filter(Boolean).join(' ')

  return (
    <Link
      href={`/festivals/${item.contentid}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        {item.firstimage ? (
          <Image
            src={item.firstimage}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-50 to-rose-50">
            <span className="text-4xl">🎪</span>
          </div>
        )}
        <div className="absolute right-2 top-2">
          <DateBadge status={status} />
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-zinc-900 group-hover:text-orange-600">
          {item.title}
        </h3>
        {location && (
          <p className="mb-1 flex items-center gap-1 text-xs text-zinc-500">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{location}</span>
          </p>
        )}
        <p className="flex items-center gap-1 text-xs text-zinc-400">
          <Calendar className="h-3 w-3 shrink-0" />
          {formatDate(item.eventstartdate)} — {formatDate(item.eventenddate)}
        </p>
      </div>
    </Link>
  )
}
