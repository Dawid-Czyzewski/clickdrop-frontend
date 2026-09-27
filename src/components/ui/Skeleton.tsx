type SkeletonProps = {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`cd-skeleton rounded-md ${className}`} aria-hidden="true" />
}

type CatalogSkeletonProps = {
  count?: number
  colsClassName?: string
}

export function CatalogSkeleton({
  count = 8,
  colsClassName = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
}: CatalogSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={`grid gap-2.5 ${colsClassName}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-lg border border-cd-border/60 p-2.5">
          <Skeleton className="aspect-[5/4] w-full" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  )
}
