import { cn } from '@/lib/cn'

interface Props {
  status: 'ongoing' | 'upcoming' | 'ended'
  className?: string
}

const config = {
  ongoing: { label: '진행중', dot: 'bg-emerald-400', bg: 'bg-emerald-50 text-emerald-700' },
  upcoming: { label: '예정', dot: 'bg-blue-400', bg: 'bg-blue-50 text-blue-700' },
  ended: { label: '종료', dot: 'bg-zinc-400', bg: 'bg-zinc-100 text-zinc-500' },
}

export default function DateBadge({ status, className }: Props) {
  const { label, dot, bg } = config[status]
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', bg, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />
      {label}
    </span>
  )
}
