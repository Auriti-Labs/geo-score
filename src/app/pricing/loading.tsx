export default function PricingLoading() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      {/* Skeleton titolo */}
      <div className="mx-auto mb-4 h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="mx-auto mb-8 h-4 w-96 animate-pulse rounded bg-muted" />
      {/* Skeleton toggle */}
      <div className="mx-auto mb-8 h-7 w-48 animate-pulse rounded-full bg-muted" />
      {/* Skeleton cards */}
      <div className="grid gap-8 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
