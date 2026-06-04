"use client";

type BlockProps = {
  className?: string;
};

export function SkeletonBlock({ className = "" }: BlockProps) {
  return (
    <div
      className={`iron-skeleton rounded-sm ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="border border-iron-border rounded-sm p-4 space-y-3 bg-iron-panel">
      <SkeletonBlock className="h-4 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock key={i} className={`h-3 ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}

type ScreenVariant = "hero" | "today" | "training" | "progress";

export function ScreenLoadingSkeleton({ variant }: { variant: ScreenVariant }) {
  return (
    <div className="mt-4 sm:mt-6 space-y-3" aria-busy="true" aria-label="Loading">
      {variant === "hero" && (
        <>
          <div className="iron-shell-card p-4 flex gap-3">
            <SkeletonBlock className="w-16 h-20 shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-3 w-1/4" />
              <SkeletonBlock className="h-6 w-2/3" />
              <SkeletonBlock className="h-3 w-1/2" />
            </div>
          </div>
          <SkeletonCard lines={2} />
          <SkeletonBlock className="h-12 w-full" />
        </>
      )}
      {variant === "today" && (
        <>
          <SkeletonCard />
          <SkeletonCard lines={4} />
        </>
      )}
      {variant === "training" && (
        <>
          <SkeletonBlock className="h-16 w-full" />
          <SkeletonCard lines={5} />
        </>
      )}
      {variant === "progress" && (
        <>
          <SkeletonCard lines={4} />
          <SkeletonCard lines={6} />
        </>
      )}
    </div>
  );
}
