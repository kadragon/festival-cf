export default function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#16162a]">
      <div className="aspect-[4/3] animate-pulse bg-white/5" />
      <div className="space-y-2.5 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-white/5" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-white/5" />
      </div>
    </div>
  )
}
