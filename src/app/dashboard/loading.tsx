export default function DashboardLoading() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      {/* Skeleton titolo */}
      <div className="mb-8 h-8 w-48 animate-pulse rounded bg-muted" />
      {/* Skeleton tabella */}
      <div className="rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-3">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b px-4 py-3 last:border-0">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
