import { cn } from '@/lib/cn'

interface Props {
  status: 'ongoing' | 'upcoming' | 'ended'
  className?: string
}

const config = {
  ongoing: {
    label: '진행중',
    tone: 'border-vermilion text-vermilion',
    dot: 'bg-vermilion',
    pulse: true,
  },
  upcoming: {
    label: '예정',
    tone: 'border-cheong text-cheong',
    dot: 'bg-cheong',
    pulse: false,
  },
  ended: {
    label: '종료',
    tone: 'border-ink-soft text-ink-soft',
    dot: 'bg-ink-soft',
    pulse: false,
  },
}

export default function DateBadge({ status, className }: Props) {
  const { label, tone, dot, pulse } = config[status]
  return (
    <span
      className={cn(
        'inline-flex -rotate-[4deg] items-center gap-1.5 border-2 bg-card/95 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em] shadow-[2px_2px_0_rgba(33,26,16,0.18)]',
        tone,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dot, pulse && 'animate-pulse')} />
      {label}
    </span>
  )
}
