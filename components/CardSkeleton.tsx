export default function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white">
      <div className="aspect-[4/3] animate-pulse bg-zinc-200" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-200" />
      </div>
    </div>
  )
}
