export default function CardSkeleton() {
  return (
    <div className="rounded-md border-2 border-ink/15 bg-card">
      <div className="aspect-[4/3] animate-pulse rounded-t-[4px] bg-paper-2" />
      <div className="relative h-0">
        <div className="absolute inset-x-3 top-0 border-t-2 border-dashed border-line" />
      </div>
      <div className="space-y-2.5 p-4 pt-5">
        <div className="h-4 w-3/4 animate-pulse rounded bg-paper-2" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-paper-2" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-paper-2" />
      </div>
    </div>
  )
}
