import { cn } from '@/lib/cn'

interface Props {
  status: 'ongoing' | 'upcoming' | 'ended'
  className?: string
}

const config = {
  ongoing: {
    label: '진행중',
    dot: 'bg-emerald-400',
    bg: 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm',
    pulse: true,
  },
  upcoming: {
    label: '예정',
    dot: 'bg-blue-400',
    bg: 'bg-blue-950/80 text-blue-300 border border-blue-500/30 backdrop-blur-sm',
    pulse: false,
  },
  ended: {
    label: '종료',
    dot: 'bg-zinc-500',
    bg: 'bg-zinc-900/80 text-zinc-400 border border-zinc-700/30 backdrop-blur-sm',
    pulse: false,
  },
}

export default function DateBadge({ status, className }: Props) {
  const { label, dot, bg, pulse } = config[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        bg,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dot, pulse && 'animate-pulse')} />
      {label}
    </span>
  )
}
