export default function AuditLoading() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-col items-center gap-4">
        {/* Skeleton cerchio score */}
        <div className="h-[180px] w-[180px] animate-pulse rounded-full bg-muted" />
        {/* Skeleton badge */}
        <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
        {/* Skeleton URL */}
        <div className="h-6 w-64 animate-pulse rounded bg-muted" />
        {/* Skeleton data */}
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      </div>
      {/* Skeleton cards */}
      <div className="mt-8 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  );
}
