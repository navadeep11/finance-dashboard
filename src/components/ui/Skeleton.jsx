// skeleton component
export function Skeleton({ width, height = 20, className = '', style = {} }) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}

// skeleton card

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="p-6 flex flex-col gap-3">
      <Skeleton width="40%" height={14} />
      <Skeleton width="60%" height={32} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={`${70 + i * 10}%`} height={13} />
      ))}
    </div>
  );
}


// skeleton row

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 dark:border-dark-border">
      <Skeleton width={36} height={36} className="rounded-full flex-shrink-0" style={{ borderRadius: '9999px' }} />
      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton width="45%" height={13} />
        <Skeleton width="25%" height={11} />
      </div>
      <Skeleton width={80} height={13} />
    </div>
  );
}
