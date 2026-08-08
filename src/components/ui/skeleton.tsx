import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return <div className={cn("skeleton-block", className)} />;
}

/** Generic page loading skeleton (matches AuthGateSkeleton pattern). */
export function PageSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="w-full min-w-0 space-y-3 stagger-in" aria-busy="true" aria-live="polite">
      <Bone className="h-24 w-full rounded-2xl" />
      <div className="grid grid-cols-3 gap-2">
        <Bone className="h-20 rounded-xl" />
        <Bone className="h-20 rounded-xl" />
        <Bone className="h-20 rounded-xl" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <Bone key={i} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="w-full min-w-0 space-y-4 stagger-in" aria-busy="true">
      <Bone className="h-[5.5rem] w-full rounded-2xl" />
      <div className="grid grid-cols-3 gap-2">
        <Bone className="h-[4.5rem] rounded-xl" />
        <Bone className="h-[4.5rem] rounded-xl" />
        <Bone className="h-[4.5rem] rounded-xl" />
      </div>
      <Bone className="h-56 w-full rounded-xl" />
      <Bone className="h-36 w-full rounded-xl" />
    </div>
  );
}

export function WorkoutSkeleton() {
  return (
    <div className="w-full min-w-0 space-y-3 stagger-in" aria-busy="true">
      <Bone className="h-16 w-full rounded-2xl" />
      <div className="flex gap-1.5 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <Bone key={i} className="h-16 w-14 shrink-0 rounded-2xl" />
        ))}
      </div>
      <Bone className="h-10 w-2/3 rounded-lg" />
      {Array.from({ length: 3 }).map((_, i) => (
        <Bone key={i} className="h-32 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export function ProgramCardSkeleton() {
  return (
    <div className="space-y-3 stagger-in" aria-busy="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <Bone key={i} className="h-28 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="w-full min-w-0 space-y-4 stagger-in" aria-busy="true">
      <Bone className="h-36 w-full rounded-2xl" />
      <div className="flex gap-3">
        <Bone className="size-16 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Bone className="h-5 w-1/2 rounded" />
          <Bone className="h-4 w-1/3 rounded" />
          <Bone className="h-4 w-2/3 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Bone className="h-16 rounded-xl" />
        <Bone className="h-16 rounded-xl" />
        <Bone className="h-16 rounded-xl" />
      </div>
      <Bone className="h-40 w-full rounded-xl" />
    </div>
  );
}

export function FeedCardSkeleton() {
  return (
    <div className="space-y-3 stagger-in" aria-busy="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card-surface space-y-3 p-3.5">
          <div className="flex items-center gap-2.5">
            <Bone className="size-10 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Bone className="h-3.5 w-1/3 rounded" />
              <Bone className="h-3 w-1/4 rounded" />
            </div>
          </div>
          <Bone className="h-20 w-full rounded-lg" />
          <div className="flex gap-4">
            <Bone className="h-4 w-12 rounded" />
            <Bone className="h-4 w-12 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Compact bone for inline use */
export { Bone as SkeletonBone };
