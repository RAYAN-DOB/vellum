import { cn } from "@/lib/utils";

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl border border-graphite bg-slate/50 shimmer",
        className,
      )}
    />
  );
}

export function WorkspaceSkeleton() {
  return (
    <main className="min-h-screen bg-abyss text-paper">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden space-y-3 lg:block">
          <SkeletonBlock className="h-4 w-24" />
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonBlock className="h-12" key={index} />
          ))}
        </aside>
        <section className="space-y-8">
          <div className="border-b border-graphite pb-8">
            <SkeletonBlock className="h-3 w-32" />
            <SkeletonBlock className="mt-5 h-14 w-full max-w-2xl" />
            <SkeletonBlock className="mt-4 h-5 w-full max-w-xl" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonBlock className="h-36 rounded-2xl" key={index} />
            ))}
          </div>
          <div className="grid gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock className="h-28 rounded-2xl" key={index} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
